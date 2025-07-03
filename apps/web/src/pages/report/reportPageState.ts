import { ApiClient } from '@/api/apiClient';
import { gql, ObservableQuery } from '@apollo/client';
import { isFiniteNumber, isNonEmptyString } from '@repo/core/client';
import { PendingReportItem, Report, ReportItem } from '@repo/graphql';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Subscription } from 'zen-observable-ts';
import { ReportItemProxy } from './reportItemProxy';

type Params = {
  year?: string | null;
  month?: string | null;
}

type Row = {
  type: 'item';
  item: ReportItemProxy;
} | {
  type: 'group';
  group: string;
}

export class ReportPageState {

  constructor() {
    makeObservable(this);
  }

  @observable.ref accessor params: Params | null = null;

  @computed get yearParam() {
    return this.params?.year ? parseInt(this.params.year) : null;
  }

  @computed get monthParam() {
    return this.params?.month ? (parseInt(this.params.month) - 1) : null;
  }

  @observable.ref accessor report: Report | null = null;

  readonly reportItemProxies = observable.array<ReportItemProxy>([], { deep: false });

  @computed get displayReportItemProxies(): ReportItemProxy[] {
    return this.reportItemProxies
      .slice().sort((a, b) => a.orderIndex - b.orderIndex)
      .filter(item => {
        const product = item.product;

        if (this.usageTypeFilter.size > 0 && !this.usageTypeFilter.has(product.usageType!))
          return false;

        if (this.searchQuery && !product.name?.toLowerCase().includes(this.searchQuery.toLowerCase()))
          return false;

        return true;
      });
  }


  @observable.ref accessor searchQuery: string | null = null;

  @computed get usageTypes() {
    return [...new Set(this.reportItemProxies
      .map(proxy => proxy.product.usageType)
      .filter(type => isNonEmptyString(type)))];
  }

  readonly usageTypeFilter = observable.set<string>([]);

  @observable.ref accessor groupField: string | null = null;

  @observable.ref accessor isFetching: boolean = false;
  @observable.ref accessor isFetchingFirst: boolean = false;
  @observable.ref accessor error: any | null = null;

  private dataQueryObservable: ObservableQuery<any, any> | null = null;
  private dataQuerySubscription: Subscription | null = null;

  @action
  async mounted(params: Params) {

    this.params = params;

    if (
      !isFiniteNumber(this.yearParam) ||
      !isFiniteNumber(this.monthParam))
      return;

    this.dataQueryObservable = ApiClient.watchQuery({
      query: gql`
        query ReportPageGetData($year: Int!, $month: Int!) {
          report(year: $year, month: $month) {
            id
            year
            month
            items {
              orderIndex
              isPending
              productId
              inInventory
              outInventory
              yearInQuantity
              inQuantity
              outQuantity
              product {
                id
                name
                unit
                packagingType
                storageType
                usageType
                observations
                registeredAt
              }
            }
            pendingItems {
              orderIndex
              isPending
              productId
              inInventory
              outInventory
              yearInQuantity
              inQuantity
              outQuantity
              product {
                id
                name
                unit
                packagingType
                storageType
                usageType
                observations
                registeredAt
              }
            }
          }
        }
      `,
      variables: {
        year: this.yearParam,
        month: this.monthParam
      },
      fetchPolicy: 'network-only'
    });

    // Subscribe to updates
    this.dataQuerySubscription = this.dataQueryObservable?.subscribe(({ loading, data, error }) => {
      runInAction(() => {

        this.isFetching = loading;
        if (!loading)
          this.isFetchingFirst = false;

        this.error = error;
        this.report = data?.report;

        this.applyReport(data?.report!);
      });
    });
  }

  @action
  unmounted() {
    this.dataQuerySubscription?.unsubscribe();
    this.dataQuerySubscription = null;
    this.dataQueryObservable = null;
  }

  async sync() {
    const upsertReportItems = this.reportItemProxies
      .filter(item => !item.isDeleted && item.isDirty)
      .map(item => {
        return {
          productId: item.productId,
          inQuantity: item.inQuantity,
          outQuantity: item.outQuantity
        };
      });

    const deletedProductIds = this.reportItemProxies
      .filter(item => item.isDeleted)
      .map(item => item.productId);

    const syncReportResponse = await ApiClient.mutate({
      mutation: gql`
        mutation SyncReport(
          $input: MutationSyncReportInput!) {

          syncReport(input: $input) {
            id
            year
            month
            items {
              orderIndex
              isPending
              productId
              inQuantity
              outQuantity
              inInventory
              outInventory
              yearInQuantity
              product {
                id
                name
                unit
                packagingType
                storageType
                usageType
                observations
                registeredAt
              }
            }
            pendingItems {
              orderIndex
              isPending
              productId
              inQuantity
              outQuantity
              inInventory
              outInventory
              yearInQuantity
              product {
                id
                name
                unit
                packagingType
                storageType
                usageType
                observations
                registeredAt
              }
            }
          }
        }`,

      variables: {
        input: {
          id: this.report?.id,
          upsertReportItems: upsertReportItems,
          deleteReportItemIds: deletedProductIds
        }
      }
    });

    this.applyReport(syncReportResponse.data.syncReport);
  }

  @action.bound
  handleSaveButtonClick() {
    this.sync();
  }

  @action
  private applyReport(report: Report) {
    this.reportItemProxies.replace([
      ...report.items?.map((item: ReportItem) => {
        return new ReportItemProxy({
          source: item,
          product: item.product!
        })
      }) ?? [],

      ...report.pendingItems?.map((item: PendingReportItem) => {
        return new ReportItemProxy({
          source: item,
          product: item.product!
        })
      }) ?? []
    ]);
  }

  @action.bound
  async handleCreateReportButtonClick() {

    if (
      !isFiniteNumber(this.yearParam) ||
      !isFiniteNumber(this.monthParam))
      return;

    const year = this.yearParam;
    const month = this.monthParam;

    const report = await ApiClient.mutate({
      mutation: gql`
        mutation CreateReport($year: Int!, $month: Int!) {
          createReport(year: $year, month: $month) {
            id
            year
            month
          }
        }
      `,
      variables: {
        year,
        month
      },
      refetchQueries: 'active'
    });

    this.report = report.data?.createReport;
    console.log(report);
  }

  @action.bound
  handleResetButtonClick() {
    this.reportItemProxies.forEach(item =>
      item.reset());
  }

  @action.bound
  handleUsageTypeFilterItemToggle(usageType: string, checked: boolean) {

    const filter = this.usageTypeFilter;
    if (checked)
      filter.add(usageType);
    else
      filter.delete(usageType);
  }
}
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { ApiClient } from '@/api/apiClient';
import { gql, type ObservableQuery } from '@apollo/client';
import type { Report } from "@repo/graphql";
import type { Subscription } from 'zen-observable-ts';

export class MasterSidebarState {
  constructor() {
    makeObservable(this);
  }

  readonly reportLookup = observable.map<string, Report>([], { deep: false });

  @computed get reports() {
    return Array.from(this.reportLookup.values());
  }

  private dataQueryObservable: ObservableQuery<any> | null = null;
  private dataQuerySubscription: Subscription | null = null;

  @action
  async mounted() {
    this.dataQueryObservable = ApiClient.watchQuery({
      query: gql`
        query MasterSidebarGetData {
          reports {
            id
            year
            month
          }
        }`
    });

    // Subscribe to updates
    this.dataQuerySubscription = this.dataQueryObservable.subscribe(({ data }) => {
      runInAction(() => {
        this.reportLookup.clear();
        data?.reports.forEach((report: Report) =>
          this.reportLookup.set(report.id!, report));
      });
    });
  }

  @action
  unmounted() {
    this.dataQuerySubscription?.unsubscribe();
    this.dataQuerySubscription = null;
    this.dataQueryObservable = null;
  }

  hasReportFor(year: number, month: number): boolean {
    return this.reports.some((report: Report) => 
      report.year === year && report.month === month);
  }
}

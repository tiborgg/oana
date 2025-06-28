import { ApiClient } from '@/api/apiClient';
import { gql } from '@apollo/client';
import { Product } from '@repo/graphql';
import { action, computed, makeObservable, observable } from 'mobx';
import { isNonEmptyString } from '@repo/core/client';
import { ProductListItemProxy } from './productListItemProxy';

type Params = {

};

export class ProductListPageState {

  constructor() {
    makeObservable(this);
  }

  @observable.ref accessor params: Params | null = null;

  readonly syncedItems = observable.array<ProductListItemProxy>([], { deep: false });
  readonly draftItems = observable.array<ProductListItemProxy>([], { deep: false });

  @computed
  get items() {
    return this.syncedItems.concat(this.draftItems);
  }

  @computed
  private get packagingTypeSuggestions() {
    return this.getSuggestions(item => [item.packagingType.value, item.packagingType.initialValue]);
  }

  @computed
  private get storageTypeSuggestions() {
    return this.getSuggestions(item => [item.storageType.value, item.storageType.initialValue]);
  }

  @computed
  private get usageTypeSuggestions() {
    return this.getSuggestions(item => [item.usageType.value, item.usageType.initialValue]);
  }

  @action
  async mounted(params: Params | null = null) {
    console.log(params);

    this.params = params;

    await this.load();
  }

  @action
  unmounted() {
    this.params = null;
  }

  @action
  async load() {
    const response = await ApiClient.query({
      query: gql`
        query GetProducts {
          products {
            id
            name
            packagingType
            storageType
            usageType
            legalNumber
            observations
            createdAt
            updatedAt
          }
        }`,
        fetchPolicy: 'network-only'
    });

    this.applyProducts(response.data.products);
  }

  async sync() {
    const upsertProducts = this.items
      .filter(item => !item.isDeleted)
      .map(item => {
        return {
          id: item.source?.id,
          name: item.name.value,
          packagingType: item.packagingType.value,
          storageType: item.storageType.value,
          usageType: item.usageType.value,
          legalNumber: item.legalNumber.value,
          observations: item.observations.value,
        };
      });

    const deletedProductIds = this.items
      .filter(item => item.isDeleted && item.source?.id)
      .map(item => item.source!.id!);

    const response = await ApiClient.mutate({
      mutation: gql`
        mutation SyncProducts(
          $input: MutationSyncProductsInput!) {

          syncProducts(input: $input) {
            id
            name
            packagingType
            storageType
            usageType
            legalNumber
            observations
          }
        }`,

      variables: {
        input: {
          upsertProducts: upsertProducts,
          deleteProductIds: deletedProductIds
        }
      }
    });

    this.applyProducts(response.data.syncProducts);
  }


  @action.bound
  handleAddButtonClick() {
    const itemProxy = new ProductListItemProxy({
      source: null,
      packagingTypeSuggestions: () => this.packagingTypeSuggestions,
      storageTypeSuggestions: () => this.storageTypeSuggestions,
      usageTypeSuggestions: () => this.usageTypeSuggestions
    });

    itemProxy.setEditing(true);
    this.draftItems.push(itemProxy);
  }

  @action.bound
  handleSaveButtonClick() {
    this.sync();
  }

  @action
  private applyProducts(products: Product[]) {
    this.draftItems.clear();
    this.syncedItems.replace(products.map((product: Product) =>
      new ProductListItemProxy({
        source: product,
        packagingTypeSuggestions: () => this.packagingTypeSuggestions,
        storageTypeSuggestions: () => this.storageTypeSuggestions,
        usageTypeSuggestions: () => this.usageTypeSuggestions
      })));
  }
  
  private getSuggestions(fieldAccessor: (item: ProductListItemProxy) => (string | null)[] | null): string[] {
    const values = this.items
      .map(item => fieldAccessor(item))
      .flat()
      .map(value => value?.trim())
      .filter(value => isNonEmptyString(value));

    return [...new Set(values)];
  }
}
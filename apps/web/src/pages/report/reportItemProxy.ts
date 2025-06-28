import { EntityNumberFieldProxy } from '@/components/input/entityNumberFieldProxy';
import { PendingReportItem, Product, ReportItem } from '@repo/graphql';
import { action, computed, makeObservable, observable } from 'mobx';

export type ReportItemProxyProps = {
  source: ReportItem | PendingReportItem;
  product: Product;
  isDraft?: boolean | null;
}

export class ReportItemProxy {

  constructor(
    private readonly props: ReportItemProxyProps) {
    makeObservable(this);

    this.inQuantityProxy = new EntityNumberFieldProxy({
      parent: this,
      value: this.source.inQuantity
    });

    this.outQuantityProxy = new EntityNumberFieldProxy({
      parent: this,
      value: this.source.outQuantity
    });

    this.isDraft = this.props.isDraft ?? false;
  }

  readonly isDraft: boolean;

  get source() {
    return this.props.source;
  }

  get isPending() {
    return this.source.isPending;
  }

  get product() {
    return this.props.product;
  }

  get productId() {
    return this.source.productId;
  }

  get orderIndex() {
    return this.source.orderIndex ?? -1;
  }

  get inInventory() {
    return this.source.inInventory;
  }

  get yearInQuantity() {
    return this.source.yearInQuantity;
  }

  get outInventory() {
    return this.source.outInventory;
  }

  @observable.ref accessor isEditing: boolean = false;
  @observable.ref accessor isDeleted: boolean = false;

  @action
  setEditing(value: boolean) {
    this.isEditing = value;
  }

  @action
  setDeleted(value: boolean) {
    this.isDeleted = value;
  }

  @action
  reset() {
    this.inQuantityProxy.reset();
    this.outQuantityProxy.reset();
  }

  readonly inQuantityProxy: EntityNumberFieldProxy;
  readonly outQuantityProxy: EntityNumberFieldProxy;

  @computed get inQuantity() {
    return this.inQuantityProxy.value;
  }

  @computed get outQuantity() {
    return this.outQuantityProxy.value;
  }

  @computed get isDirty() {
    return (
      this.inQuantityProxy.isDirty ||
      this.outQuantityProxy.isDirty
    );
  }
}
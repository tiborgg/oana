import { action, computed, makeObservable, observable } from 'mobx';
import { IEntityProxy } from './entityInputSchema';

type EntityNumberFieldProxyProps = {
  parent: IEntityProxy;
  value?: number | null;
  initialValue?: number | null;
}

export class EntityNumberFieldProxy {

  constructor(
    props: EntityNumberFieldProxyProps) {
    makeObservable(this);

    this.parent = props.parent;

    this.value = props.value ?? null;
    this.initialValue = 'initialValue' in props ?
      (props.initialValue ?? null) :
      (props.value ?? null);
  }

  readonly parent: IEntityProxy;

  @computed get isEditing() {
    return this.parent.isEditing;
  }

  @computed get isDirty() {
    return this.initialValue !== this.value;
  }

  @observable.ref accessor initialValue: number | null;
  @observable.ref accessor value: number | null;

  @action
  reset() {
    this.value = this.initialValue;
  }
}
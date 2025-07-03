import { action, computed, makeObservable, observable } from 'mobx';
import { IEntityProxy } from './entityInputSchema';

type EntitySelectFieldProxyProps = {
  parent: IEntityProxy;
  value?: string | null;
  initialValue?: string | null;
  items?: Record<string, string>;
}

export class EntitySelectFieldProxy {

  constructor(
    props: EntitySelectFieldProxyProps) {
    makeObservable(this);

    this.parent = props.parent;

    this.value = props.value ?? null;
    this.initialValue = 'initialValue' in props ?
      (props.initialValue ?? null) :
      (props.value ?? null);

    this.items = props.items ?? null;
  }

  readonly parent: IEntityProxy;
  readonly items: Record<string, string> | null;

  @computed get isEditing() {
    return this.parent.isEditing;
  }

  @computed get isDirty() {
    return this.initialValue !== this.value;
  }

  @observable.ref accessor initialValue: string | null;
  @observable.ref accessor value: string | null;


  @action
  reset() {
    this.value = this.initialValue;
  }
}
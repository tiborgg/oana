import { action, computed, makeObservable, observable } from 'mobx';
import { IEntityProxy } from './entityInputSchema';

type EntityTextFieldProxyProps = {
  parent: IEntityProxy;
  value?: string | null;
  initialValue?: string | null;
}

export class EntityTextFieldProxy {

  constructor(
    props: EntityTextFieldProxyProps) {
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
  
  @observable.ref accessor initialValue: string | null;
  @observable.ref accessor value: string | null;
  
  @action
  reset() {
    this.value = this.initialValue;
  }
}
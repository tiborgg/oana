import { Dayjs } from 'dayjs';
import { action, computed, makeObservable, observable } from 'mobx';
import { IEntityProxy } from './entityInputSchema';

type EntityDateTimeFieldProxyProps = {
  parent: IEntityProxy;
  value?: Dayjs | null;
  initialValue?: Dayjs | null;
}

export class EntityDateTimeFieldProxy {

  constructor(
    props: EntityDateTimeFieldProxyProps) {
    makeObservable(this);

    this.parent = props.parent;

    this.value = props.value ?? null;
    this.initialValue = 'initialValue' in props ?
      (props.initialValue ?? null) :
      (props.value ?? null);

    this.calendarMonth = props.value?.toDate() ?? null;
  }

  readonly parent: IEntityProxy;

  @computed get isEditing() {
    return this.parent.isEditing;
  }

  @computed get isDirty() {
    if (this.initialValue)
      return !this.initialValue.isSame(this.value);
    if (this.value)
      return true;
    return false;
  }

  @observable.ref accessor initialValue: Dayjs | null;
  @observable.ref accessor value: Dayjs | null;

  @observable.ref accessor calendarMonth: Date | null = null;

  @action
  setCalendarMonth(value: Date) {
    this.calendarMonth = value;
  }

  @action.bound
  handleCalendarMonthChange(value: Date) {
    this.setCalendarMonth(value);
  }

  @action
  reset() {
    this.value = this.initialValue;
    this.calendarMonth = null;
  }
}
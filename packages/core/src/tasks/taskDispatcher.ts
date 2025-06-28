import { action, makeObservable, observable } from 'mobx';
import { ITask, TaskFactory } from './taskSchema';

type Props<TTask extends ITask<any>> = {
  factory: TaskFactory<TTask>;
}

export class TaskDispatcher<TTask extends ITask<any>> {
  constructor(props: Props<TTask>) {
    makeObservable(this);
    this.factory = props.factory;
  }

  readonly factory: TaskFactory<TTask>;

  @observable.ref accessor task: TTask | null = null;

  @action
  run() {
    this.reset();

    this.task = this.factory();
    this.task.run();
  }

  @action
  reset() {
    if (this.task)
      this.task.abort();
    this.task = null;
  }
}
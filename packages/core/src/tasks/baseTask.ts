import { action, computed, makeObservable, observable } from 'mobx';
import { Error, ErrorGroup, toError } from '../errors';
import { TaskStatus } from './taskConst';
import { PromiseRelay } from '../async';
import type { AsyncResult, Result } from '../types';

type Props = {
  abortSignal?: AbortSignal | null;
}

export type BaseTaskProps = Props;

export abstract class BaseTask<T = true> {

  constructor(props: Props = {}) {
    makeObservable(this);

    const { abortSignal } = props;

    this.externalAbortSignal = abortSignal ?? null;

    abortSignal?.addEventListener('abort', () => {
      this.abortController.abort();
    });

    if (abortSignal?.aborted)
      this.abortController.abort();
  }

  readonly externalAbortSignal: AbortSignal | null = null;

  private readonly abortController = new AbortController();
  get abortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  readonly promiseRelay = new PromiseRelay<Result<T>>();
  get promise(): AsyncResult<T> {
    return this.promiseRelay.promise;
  }

  @observable.ref accessor status: TaskStatus = TaskStatus.Idle;
  @observable.ref accessor result: Result<T> | null = null;

  @computed
  get value(): T | null {
    return this.result?.[0] ?? null;
  }

  @computed
  get error(): Error | null {
    return this.result?.[1] ?? null;
  }

  @computed
  get isIdle() {
    return this.status === TaskStatus.Idle;
  }

  @computed
  get isRunning() {
    return this.status === TaskStatus.Running;
  }

  @computed
  get isCompleted() {
    return this.status === TaskStatus.Completed;
  }

  @computed
  get isError() {
    return this.status === TaskStatus.Error;
  }

  @computed
  get isSettled() {
    return (this.isCompleted || this.isError);
  }

  @computed
  get isAborted() {
    return this.error?.code === 'Aborted';
  }

  abstract taskExecutor(): AsyncResult<T>;

  async run(): AsyncResult<T> {

    if (this.abortSignal.aborted)
      return this.setError(new Error('Aborted'));
      
    this.setRunning();

    const [res, err] = await this.taskExecutor();

    if (err) {
      this.setError(err);
      return [null, err];
    }

    this.setCompleted(res);
    return [res];
  }

  abort() {

    this.abortController.abort();
    return true;
  }

  @action
  setRunning(): Result<unknown> {

    if (this.isRunning)
      return [null, new Error('TaskAlreadyRunning')];

    this.status = TaskStatus.Running;
    this.result = null;

    return [true];
  }

  @action
  setResult(res: Result<T>): Result<T> {

    this.result = res;
    const [val, err] = res;

    if (err)
      this.status = TaskStatus.Error;
    else
      this.status = TaskStatus.Completed;

    this.promiseRelay.resolve(res);
    return res;
  }

  @action
  setCompleted(val: T): Result<T> {
    return this.setResult([val]);
  }

  @action
  setError(err: Error | string): Result<T> {
    const errObj = toError(err);
    return this.setResult([null, errObj]);
  }

  @action
  handleSubTaskErrors(errs: Error[]) {
    const errGroup = new ErrorGroup({ errors: errs });
    return this.setError(errGroup);
  }
}
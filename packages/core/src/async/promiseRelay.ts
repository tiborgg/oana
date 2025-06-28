import { Error } from '../errors/error';
import { NativePromiseRejectFunc, NativePromiseResolveFunc } from './asyncSchema';

export type PromiseRelayProps = {
  timeout?: number | null;
  autoStart?: boolean | null;
}

const DefaultProps: PromiseRelayProps = {
  timeout: null,
  autoStart: false
}

/**
 * Wrapper around a Promise object which can be controlled externally.
 */
export class PromiseRelay<T> {

  constructor(props: PromiseRelayProps = DefaultProps) {
    props = {
      ...DefaultProps,
      ...props
    };

    this.promise = new Promise((res, rej) => {
      this.resolvePromise = res;
      this.rejectPromise = rej;
    });

    this.timeout = props.timeout ?? null;
    this.autoStart = props.autoStart ?? null;

    if (this.autoStart !== false)
      this.start();
  }

  promise: Promise<T>;
  value: T | null = null;
  error: Error | null = null;
  isResolved = false;
  isRejected = false;

  get isSettled() {
    return this.isResolved || this.isRejected;
  }

  readonly timeout: number | null = null;
  readonly autoStart: boolean | null = null;

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  private resolvePromise!: NativePromiseResolveFunc<T>;
  private rejectPromise!: NativePromiseRejectFunc<Error>;

  start() {
    const { timeout } = this;
    if (timeout)
      this.timeoutId = setTimeout(this.handleTimeout, timeout);
  }

  resolve(val?: T) {
    if (this.isSettled) {
      if (process.env.NODE_ENV !== 'production')
        console.warn(`PromiseRelay has already been settled. Call will be discarded.`);
      return;
    }

    this.resolvePromise(val!);
    this.isResolved = true;
    this.value = val ?? null;
    this.clearTimeout();
  }

  reject(err?: Error) {
    if (this.isSettled) {
      if (process.env.NODE_ENV !== 'production')
        console.warn(`PromiseRelay has already been settled. Call will be discarded.`);
      return;
    }

    this.rejectPromise(err);
    this.isRejected = true;
    this.error = err ?? null;
    this.clearTimeout();
  }

  private clearTimeout = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private handleTimeout = () => {
    if (this.isSettled)
      return console.warn(`PromiseRelay has already been settled but a timeout handler has been invoked.`);

    this.reject(new Error('Aborted'));
  }
}
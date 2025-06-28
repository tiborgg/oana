import { Error } from './errors/error';
import { OptionalKeysOf } from 'type-fest';

export type Maybe<T> = T | null | undefined;
export type MaybePartial<T> = Maybe<Partial<T>>;

export type MaybeProps<T> = {
  [key in keyof T]?: Maybe<T[key]>
};

export type NullableProps<T> = {
  [key in keyof T]?: T[key] | null;
};

export type RequiredProps<T> = {
  [P in keyof Required<T>]: NonNullable<T[P]>;
}

export type FilterOptionalProps<T extends object> = Pick<T, OptionalKeysOf<T>>

export type Enum = Record<string, string | number>;

export type CompletedResult<TResult = true> =
  [TResult] |
  [TResult, null];

export type ErrorResult<TPartialValue = never> =
  [null, Error<TPartialValue>];

export type Result<TResult = true, TPartialValue = never> =
  CompletedResult<TResult> |
  ErrorResult<TPartialValue>;

export type NullableResult<TResult = true, TPartialValue = never> =
  Result<TResult | null, TPartialValue | null>;

export type AsyncResult<TResult = true, TPartialValue = never> =
  Promise<Result<TResult, TPartialValue>>;

export type AsyncNullableResult<TResult = true, TPartialValue = never> =
  AsyncResult<TResult | null, TPartialValue | null>;
  
export type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never;

export type Key = string | number | symbol;

export type Constructor<T = {}> = new (...args: any[]) => T;

export type TimeoutId = ReturnType<typeof setTimeout>;
export type IntervalId = ReturnType<typeof setInterval>;
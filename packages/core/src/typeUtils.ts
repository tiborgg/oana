import { Error, NativeError, toError } from './errors';
import { AsyncResult, CompletedResult, ErrorResult, Maybe, Result } from './types';

export function isNullOrUndefined(arg: any): arg is null | undefined {
  return arg === null || arg === undefined;
}

export function isDefined<T>(arg: Maybe<T>): arg is Exclude<T, null | undefined | void> {
  return !isNullOrUndefined(arg);
}

export function isDefinedObject<T>(arg: any): arg is object & Exclude<T, null | undefined> {
  return typeof arg === 'object' && arg !== null;
}

export function isFiniteNumber<T>(arg: any): arg is number {
  return Number.isFinite(arg);
}

export function isPositiveFiniteNumber<T>(arg: any): arg is number {
  return isFiniteNumber(arg) && arg > 0;
}

export function isInteger(arg: any): arg is number {
  return Number.isInteger(arg);
}

export function isNonEmptyString(arg: any): arg is string {
  return typeof arg === 'string' && arg.length > 0;
}

export function isFunction<T>(arg: any): arg is Function {
  return typeof arg === 'function'
}

export function isSet<T = any>(arg: any): arg is Set<T> {
  return arg instanceof Set;
}

/*
 * Returns `true` if the provided value is `true`, `1` or the `'true'` string (regardless of casing).
 * Useful for reading env variables or when dealing with weakly typed APIs.
 */
export function isTrue(val: any) {
  return (
    val === true ||
    val === 1 ||
    (typeof val === 'string' && val.toLowerCase() === 'true'));
}

/**
 * Returns `true` if the provided value is `false`, `0` or the `'false'` string (regardless of casing).
 * Useful for reading env variables or when dealing with weakly typed APIs.
 */
export function isFalse(val: any) {
  return (
    val === false ||
    val === 0 ||
    (typeof val === 'string' && val.toLowerCase() === 'false'));
}

function isResultTuple<T = any>(arg: any): arg is [any] | [any, any] {

  return (
    Array.isArray(arg) &&
    new Set([1, 2]).has(arg.length));
}

export function isResult<T = any>(arg: any): arg is Result<T> {

  return (
    isCompletedResult(arg) ||
    isErrorResult(arg));
}

export function isCompletedResult<T = any>(arg: any): arg is CompletedResult<T> {

  if (!isResultTuple(arg))
    return false;

  return (
    isDefined(arg[0]) &&
    !isDefined(arg[1]) &&
    !(arg[0] instanceof Error))
}


export function isErrorResult(arg: any, code?: string): arg is ErrorResult {

  if (!isResultTuple(arg))
    return false;

  if (
    isDefined(arg[0]) ||
    !(arg[1] instanceof Error))
    return false;

  if (code && arg[1].code !== code)
    return false;

  return true;
}

export function getResultArrayErrors<T>(arg: Result<T>[]): Error[] {
  return arg
    .map(res => res[1]!)
    .filter(err => isDefined(err));
}

export function getResultArrayValues<T>(arg: Result<T>[]): T[] {
  return arg
    .map(res => res[0]!)
    .filter(err => isDefined(err));
}


export function toNativeError(err: Error): NativeError {

  return new NativeError(
    `An Error has occurred:\n` +
    `Code: ${err.code}\n` +
    `Message: ${err.message}\n` +
    `Source: ${err.source}\n` +
    `Inner Error: ${err.innerError}\n` +
    `Partial Value: ${err.partialValue}\n` +
    `Data: ${JSON.stringify(err.data)}`); // TODO: add proper display of error data
}

/**
 * Simple utility in which to wrap synchronous `Result` objects and
 * either return their data (first element of the tuple) or 
 * throw the Error (second element of the tuple), depending on the result type.
 * Useful for quickly switching between managed `Result` objects
 * and native / vendor calls which expect the data directly or expect the code to throw.
 */
export function unwrapResult<T>(result: Result<T>, throwNativeError = false): T {
  const [data, err] = result;

  if (err) {
    if (throwNativeError)
      throw toNativeError(err);
    throw err;
  }

  return data;
}

/**
 * Similar to `unwrapResult` but awaits on the provided `AsyncResult`.
 */
export async function unwrapAsyncResult<T>(result: AsyncResult<T>): Promise<T> {
  const [data, err] = await result;
  if (err)
    throw err;
  return data;
}
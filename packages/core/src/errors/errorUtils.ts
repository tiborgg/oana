import { Maybe, Result } from '../types';
import { isDefined, isNullOrUndefined, isResult } from '../typeUtils';
import { Error, ErrorProps } from './error';
import { ErrorGroup } from './errorGroup';
import { DefaultErrorHeading, DefaultErrorMessage } from './errorSchema';
import { NativeError } from './nativeError';

export function getErrorDisplayMessage(
  err: Error | string | null | undefined,
  defaultMessage = DefaultErrorMessage) {

  if (typeof err === 'string')
    return err;
  return err?.displayMessage ?? defaultMessage;
}

export function getErrorDisplayHeading(
  err: Error | string | null | undefined,
  defaultHeading = DefaultErrorHeading) {

  if (typeof err === 'string')
    return err;
  return err?.displayHeading ?? defaultHeading;
}

export function isNativeError(arg: any): arg is NativeError {
  return arg instanceof NativeError;
}

export function isError(arg: any): arg is Error {
  return arg instanceof Error;
}

export function isErrorGroup(arg: any): arg is ErrorGroup {
  return (
    arg instanceof Error &&
    arg.code === 'ErrorGroup');
}

export function isErrorResult(arg: any, code?: string | null): arg is [null, Error] {
  const isErrorRes = (
    isResult(arg) &&
    arg[1] instanceof Error);

  if (!isErrorRes)
    return false;

  if (code)
    return arg[1]?.code === code;

  return true;
}

export function getErrorsFromResultArray(arg: Result<any>[]): Error[] {

  return arg
    .map(res => res[1]! ?? null)
    .filter(err => isError(err));
}

/**
 * Returns an array of `Error` objects based on the provided array of possibly 
 * `null` or `undefined` `Error` objects.
 * If `flatten` is true then any `ErrorGroup` instance will be unwrapped and its 
 * `childError` array will be added to the output array. Otherwise the `ErrorGroup` 
 * instance will be added as it is to the output array.
 */
export function getErrorArray(maybeErrors: Maybe<Error>[], flatten = true): Error[] {
  const errors = maybeErrors.filter(err => isDefined(err));
  const errorArray: Error[] = [];

  for (const err of errors) {

    if (err.code === 'ErrorGroup') {
      const { childErrors } = err;
      
      if (flatten) {

        const flattenedChildErrors = childErrors
          .map(err => getErrorArray([err], true))
          .flat();
  
        errorArray.push(...flattenedChildErrors);
      } else {
        errorArray.push(err);
      }
  
    } else {
      errorArray.push(err);
    }
  }

  return errorArray;
}

/**
 * If the provided array has a single item, then that item will be returned directly.
 * If the provided array has more than one item, a new Error with the code ErrorGroup will be created and returned.
 * If the provided array has no items then the default is returned, which can either be another Error or null.
 */
export function createErrorFromArray(maybeErrors: Maybe<Error>[], flatten = true, defaultError: Error = new Error('UnknownError')): Error {
  const errors = maybeErrors.filter(err =>
    isDefined(err));

  if (!Array.isArray(errors) || errors.length === 0)
    return defaultError;

  if (errors.length === 1)
    return errors[0] as Error;

  const errorArray = getErrorArray(errors, flatten);

  return new ErrorGroup({
    errors: errorArray
  });
}

export function createErrorFromErrorCodeArray(errorCodes: Maybe<string>[], flatten = false, defaultErrorCode: string = 'UnknownError'): Error {
  errorCodes = errorCodes.filter(errCode =>
    isDefined(errCode));

  return createErrorFromArray(
    errorCodes.map(code => new Error(code!)), // non-null coallesced because it was filtered above
    flatten,
    new Error(defaultErrorCode));
}

export function toError(arg: null | undefined): null;
export function toError(arg: NonNullable<any>, props?: ErrorProps): Error;
export function toError(arg: any, props: ErrorProps = {}): Error | null {
  if (isNullOrUndefined(arg))
    return null;

  if (isError(arg))
    return arg;

  if (typeof arg === 'string' && arg.length > 0)
    return new Error(arg as string, props);

  return new Error('UnknownError', {
    ...props,
    source: arg
  });
}

/**
 * Returns true if the provided object is an instance of DOMException
 * and the error is an AbortError.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-AbortError
 */
export function isDOMAbortError(err: any): err is DOMException {

  return (
    (err instanceof DOMException) && (
      // the code and constant appear in MDN as "legacy", so currently I'm unsure
      // whether they will work in every browser or not and if they're futureproof against deprecation
      // this is why the check is so verbose
      (err.code === DOMException.ABORT_ERR) ||
      (err.name === 'AbortError') ||
      (err.message === 'Aborted')));
}
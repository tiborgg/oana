import type { ReactNode } from 'react';
import { ErrorLookup } from './errorLookup';

type Props<TPartialValue = never> = {
  /**
   * Contains the object on which this Error will be based.
   * Can be an API response object, a response string, a native Error instance, etc.
   */
  source?: any | null;

  /**
   * Used when the Error to be instanced is based on another Error 
   * and you want to keep track of the original error.
   */
  innerError?: Error | null;

  message?: string | null;

  displayMessage?: ReactNode | null;

  displayHeading?: ReactNode | null;
 
  /** @inheritDoc Error.partialValue */
  partialValue?: TPartialValue | null;

  data?: any;
}

export type ErrorProps = Props;

export class Error<TPartialValue = never> {
  constructor(code: string, props: Props = {}) {

    const info = ErrorLookup[code] ?? null;

    this.code = code;
    this.message = props.message ?? info?.message ?? `An error has occurred.`;
    this.displayHeading = props.displayHeading ?? info?.displayHeading ?? null;
    this.displayMessage = props.displayMessage ?? info?.displayMessage ?? this.message;
    this.source = props.source ?? null;
    this.innerError = props.innerError ?? null;
    this.partialValue = props.partialValue ?? null;
    this.data = props.data ?? null;
  }

  readonly code: string;
  readonly message: string;
  readonly displayHeading: ReactNode | null;
  readonly displayMessage: ReactNode | null;
  readonly source: any | null = null;
  readonly childErrors: Error[] = [];
  readonly innerError: Error | null = null;
  readonly data: any;

  /**
   * In case of operations which can partially fail (or succeed, depending on how you look at it),
   * like GraphQL operations which can return a result but also return errors,
   * this field can keep that partial result, while the Error object itself signals that something has gone wrong.
   */
  readonly partialValue: TPartialValue | null = null;
}
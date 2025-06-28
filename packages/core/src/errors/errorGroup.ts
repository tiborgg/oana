import { Error } from './error';

type Props<TPartialValue = any> = {
  errors: Error[];

  /**
   * Contains the object on which this ErrorGroup will be based.
   * Can be an API response object, a response string, a native Error instance, etc.
   */
  source?: any | null;

  message?: string | null;

  /** @inheritDoc Error.partialValue */
  partialValue?: TPartialValue | null;
}

export class ErrorGroup
  extends Error {

  constructor(props: Props) {
    super('ErrorGroup', props);
    this.childErrors = props.errors;
  }
  
  readonly childErrors: Error[] = [];
}
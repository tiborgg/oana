import { ReactNode } from 'react';
import { Error } from './error';

export type ErrorDescriptor = {
  message?: string | null;
  displayHeading?: string | null;
  displayMessage?: ReactNode | null;
  canBeUserTriggered?: boolean | null;
}

export type ErrorTransform = (rawErr: any) => Error;

export type ErrorSource = Error | string;

export const DefaultErrorMessage = 'An error has occurred.';
export const DefaultErrorHeading = 'Oops, something went wrong.';
import { HttpErrorResponse } from '@angular/common/http';
import { type Observable, type OperatorFunction, catchError, map, of, startWith, throwError } from 'rxjs';

import { ApiContractError, type ApiError } from '../models/api-contract';
import type { ApiState } from '../models/api-state';

/** Turns a failed HTTP response into the ApiError the UI can show. */
export function toApiError(error: HttpErrorResponse): ApiError {
  if (error.status === 0) {
    return { kind: 'network', message: 'Could not reach the server. Is the mock API running?' };
  }
  if (error.status === 404) {
    return { kind: 'not-found', message: 'Not found.' };
  }
  return {
    kind: 'server',
    status: error.status,
    message: `The server returned an error (${error.status}).`,
  };
}

/** Turns data that breaks the API contract into a validation ApiError. */
export function toContractApiError(error: ApiContractError): ApiError {
  return {
    kind: 'validation',
    message: 'The server sent data the app cannot display.',
    fieldErrors: { [error.field]: [error.message] },
  };
}

/**
 * Wraps an API call in ApiState: emits `loading` first, then `success` with the data
 * or `error` with an ApiError. Any other error is a bug, so it's rethrown.
 */
export function toApiState<T>(): OperatorFunction<T, ApiState<T>> {
  return (source: Observable<T>) =>
    source.pipe(
      map((data): ApiState<T> => ({ status: 'success', data })),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          return of<ApiState<T>>({ status: 'error', error: toApiError(error) });
        }
        if (error instanceof ApiContractError) {
          return of<ApiState<T>>({ status: 'error', error: toContractApiError(error) });
        }
        return throwError(() => error);
      }),
      startWith<ApiState<T>>({ status: 'loading' }),
    );
}
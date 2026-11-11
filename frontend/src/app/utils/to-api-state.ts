import { HttpErrorResponse } from '@angular/common/http';
import { type Observable, type OperatorFunction, catchError, map, of, startWith, throwError } from 'rxjs';

import type { ApiError } from '../models/api-contract';
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

/**
 * Wraps an HTTP call in ApiState: emits `loading` first, then `success` with the data
 * or `error` with an ApiError. Errors that aren't HTTP errors are bugs, so they're rethrown.
 */
export function toApiState<T>(): OperatorFunction<T, ApiState<T>> {
  return (source: Observable<T>) =>
    source.pipe(
      map((data): ApiState<T> => ({ status: 'success', data })),
      catchError((error: unknown) =>
        error instanceof HttpErrorResponse
          ? of<ApiState<T>>({ status: 'error', error: toApiError(error) })
          : throwError(() => error),
      ),
      startWith<ApiState<T>>({ status: 'loading' }),
    );
}
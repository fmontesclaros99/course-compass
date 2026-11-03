import type { ApiError } from './api-contract';

/** The state of one API request. `status` is the discriminant. */
export type ApiState<T> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: ApiError };

export type ApiStatus = ApiState<unknown>['status'];

/**
 * One handler per status. Each handler receives only its own variant,
 * so `success` gets `data` and `error` gets `error`.
 */
export type ApiStateHandlers<T, R> = {
  readonly [S in ApiStatus]: (state: Extract<ApiState<T>, { status: S }>) => R;
};

/** Calls the handler that matches the current status. */
export function matchApiState<T, R>(state: ApiState<T>, handlers: ApiStateHandlers<T, R>): R {
  switch (state.status) {
    case 'idle':
      return handlers.idle(state);
    case 'loading':
      return handlers.loading(state);
    case 'success':
      return handlers.success(state);
    case 'error':
      return handlers.error(state);
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
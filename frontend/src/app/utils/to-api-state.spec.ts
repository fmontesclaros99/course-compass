import { HttpErrorResponse } from '@angular/common/http';
import { type Observable, firstValueFrom, of, throwError, toArray } from 'rxjs';

import { toApiState } from './to-api-state';

/** Collects every state the operator emits, in order. */
function statesOf<T>(source: Observable<T>) {
  return firstValueFrom(source.pipe(toApiState(), toArray()));
}

function httpError(status: number): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status }));
}

describe('toApiState', () => {
  it('emits loading, then success with the data', async () => {
    expect(await statesOf(of(['c-101']))).toEqual([
      { status: 'loading' },
      { status: 'success', data: ['c-101'] },
    ]);
  });

  it('maps a 404 to a not-found error', async () => {
    expect(await statesOf(httpError(404))).toEqual([
      { status: 'loading' },
      { status: 'error', error: { kind: 'not-found', message: 'Not found.' } },
    ]);
  });

  it('maps status 0 to a network error', async () => {
    const [, state] = await statesOf(httpError(0));

    expect(state).toMatchObject({ status: 'error', error: { kind: 'network' } });
  });

  it('maps other HTTP errors to a server error with the status code', async () => {
    const [, state] = await statesOf(httpError(500));

    expect(state).toMatchObject({ status: 'error', error: { kind: 'server', status: 500 } });
  });

  it('rethrows errors that are not HTTP errors', async () => {
    const bug = new TypeError('bug');

    await expect(statesOf(throwError(() => bug))).rejects.toBe(bug);
  });
});
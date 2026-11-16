import type { Course } from './course.model';
import { type ApiState, type ApiStateHandlers, matchApiState } from './api-state';

const describeState: ApiStateHandlers<Course[], string> = {
  idle: () => 'Search for a course',
  loading: () => 'Loading…',
  success: (state) => `${state.data.length} courses`,
  error: (state) => state.error.message,
};

describe('matchApiState', () => {
  it('calls the handler for each status', () => {
    const states: ApiState<Course[]>[] = [
      { status: 'idle' },
      { status: 'loading' },
      { status: 'success', data: [] },
      { status: 'error', error: { kind: 'network', message: 'Could not reach the server' } },
    ];

    expect(states.map((state) => matchApiState(state, describeState))).toEqual([
      'Search for a course',
      'Loading…',
      '0 courses',
      'Could not reach the server',
    ]);
  });

  it('only allows data on the success state', () => {
    // @ts-expect-error a loading state has no data
    const invalid: ApiState<Course[]> = { status: 'loading', data: [] };
    expect(invalid.status).toBe('loading');
  });
});
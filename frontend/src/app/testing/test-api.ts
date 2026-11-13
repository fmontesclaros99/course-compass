import type { Provider } from '@angular/core';

import { API_BASE_URL } from '../api-base-url';

/** Fake API address for specs. HttpTestingController intercepts every request to it. */
export const TEST_API_BASE_URL = 'http://api.test';
export const TEST_COURSES_URL = `${TEST_API_BASE_URL}/courses`;

export const testApiBaseUrlProvider: Provider = { provide: API_BASE_URL, useValue: TEST_API_BASE_URL };
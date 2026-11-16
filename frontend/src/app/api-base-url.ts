import { InjectionToken } from '@angular/core';

/** Base URL of the CourseCompass API. Provided in app.config.ts. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
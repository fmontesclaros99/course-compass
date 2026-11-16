import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ApiContractError } from '../models/api-contract';
import { SEED_COURSES } from '../testing/seed-courses';
import { TEST_COURSES_URL, testApiBaseUrlProvider } from '../testing/test-api';
import { getCourseOrThrow } from '../utils/course-utils';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), testApiBaseUrlProvider],
    });
    service = TestBed.inject(CourseService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Fails the test if a request was made that the test didn't expect.
    httpTesting.verify();
  });

  it('gets the courses from GET /courses', async () => {
    const courses = firstValueFrom(service.getCourses());

    const request = httpTesting.expectOne(TEST_COURSES_URL);
    expect(request.request.method).toBe('GET');
    request.flush(SEED_COURSES);

    expect(await courses).toEqual(SEED_COURSES);
  });

  it('gets one course from GET /courses/{id}', async () => {
    const expected = getCourseOrThrow(SEED_COURSES, 'c-106');
    const course = firstValueFrom(service.getCourse('c-106'));

    const request = httpTesting.expectOne(`${TEST_COURSES_URL}/c-106`);
    expect(request.request.method).toBe('GET');
    request.flush(expected);

    expect(await course).toEqual(expected);
  });

  it('passes an HTTP error on to the caller', async () => {
    const courses = firstValueFrom(service.getCourses());

    httpTesting
      .expectOne(TEST_COURSES_URL)
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    await expect(courses).rejects.toMatchObject({ status: 500 });
  });

  it('rejects a course with a level the app does not know', async () => {
    const courses = firstValueFrom(service.getCourses());

    httpTesting.expectOne(TEST_COURSES_URL).flush([{ ...SEED_COURSES[0], level: 'expert' }]);

    await expect(courses).rejects.toBeInstanceOf(ApiContractError);
  });
});
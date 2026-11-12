import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SEED_COURSES } from '../testing/seed-courses';
import { getCourseOrThrow } from '../utils/course-utils';
import { COURSES_API_URL, CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
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

    const request = httpTesting.expectOne(COURSES_API_URL);
    expect(request.request.method).toBe('GET');
    request.flush(SEED_COURSES);

    expect(await courses).toEqual(SEED_COURSES);
  });

  it('gets one course from GET /courses/{id}', async () => {
    const expected = getCourseOrThrow(SEED_COURSES, 'c-106');
    const course = firstValueFrom(service.getCourse('c-106'));

    const request = httpTesting.expectOne(`${COURSES_API_URL}/c-106`);
    expect(request.request.method).toBe('GET');
    request.flush(expected);

    expect(await course).toEqual(expected);
  });

  it('passes an HTTP error on to the caller', async () => {
    const courses = firstValueFrom(service.getCourses());

    httpTesting
      .expectOne(COURSES_API_URL)
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    await expect(courses).rejects.toMatchObject({ status: 500 });
  });
});
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { render, screen, within } from '@testing-library/angular';

import { SEED_COURSES } from '../../testing/seed-courses';
import { getCourseOrThrow } from '../../utils/course-utils';
import { COURSES_API_URL } from '../course.service';
import { CourseDetailComponent } from './course-detail.component';

async function setup(id: string) {
  await render(CourseDetailComponent, {
    inputs: { id },
    providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
  });
  return TestBed.inject(HttpTestingController);
}

describe('CourseDetailComponent', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('loads the course for the id and shows its details', async () => {
    const http = await setup('c-106');
    expect(screen.getByRole('status')).toHaveTextContent('Loading course…');

    http.expectOne(`${COURSES_API_URL}/c-106`).flush(getCourseOrThrow(SEED_COURSES, 'c-106'));

    expect(
      await screen.findByRole('heading', { name: 'Entity Framework Core in Action' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('190 min')).toBeInTheDocument();
    const tags = within(screen.getByRole('list', { name: 'Tags' })).getAllByRole('listitem');
    expect(tags.map((tag) => tag.textContent)).toEqual(['ef-core', 'database', 'migrations']);
  });

  it('shows "Course not found." on a 404', async () => {
    const http = await setup('c-999');

    http.expectOne(`${COURSES_API_URL}/c-999`).flush(null, { status: 404, statusText: 'Not Found' });

    expect(await screen.findByRole('alert')).toHaveTextContent('Course not found.');
  });

  it('links back to the search page', async () => {
    const http = await setup('c-106');
    http.expectOne(`${COURSES_API_URL}/c-106`).flush(getCourseOrThrow(SEED_COURSES, 'c-106'));

    expect(screen.getByRole('link', { name: /Back to search/ })).toHaveAttribute('href', '/');
  });
});
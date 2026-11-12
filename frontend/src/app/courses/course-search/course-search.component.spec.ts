import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { render, screen, waitFor, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { SEED_COURSES } from '../../testing/seed-courses';
import { COURSES_API_URL } from '../course.service';
import { CourseSearchComponent } from './course-search.component';

/** Stands in for the detail page so navigation has somewhere to go. */
@Component({ template: '' })
class DetailStubComponent {}

async function setup() {
  const user = userEvent.setup();
  await render(CourseSearchComponent, {
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([{ path: 'courses/:id', component: DetailStubComponent }]),
    ],
  });
  return { user, http: TestBed.inject(HttpTestingController) };
}

/** The course buttons currently in the list. */
async function shownCourses() {
  const list = await screen.findByRole('list', { name: 'Courses' });
  return within(list).getAllByRole('button');
}

describe('CourseSearchComponent', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('shows a loading message, then the courses from the API', async () => {
    const { http } = await setup();
    expect(screen.getByRole('status')).toHaveTextContent('Loading courses…');

    http.expectOne(COURSES_API_URL).flush(SEED_COURSES);

    expect(await shownCourses()).toHaveLength(6);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('filters the list by the search text', async () => {
    const { user, http } = await setup();
    http.expectOne(COURSES_API_URL).flush(SEED_COURSES);

    await user.type(await screen.findByRole('searchbox', { name: 'Search' }), 'core');

    expect(await shownCourses()).toHaveLength(2);
    expect(screen.getByRole('button', { name: /ASP.NET Core Web API Fundamentals/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entity Framework Core in Action/ })).toBeInTheDocument();
  });

  it('filters the list by level', async () => {
    const { user, http } = await setup();
    http.expectOne(COURSES_API_URL).flush(SEED_COURSES);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Level' }), 'Advanced');

    expect(await shownCourses()).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: /Multi-tenant Theming with CSS Custom Properties/ }),
    ).toBeInTheDocument();
  });

  it('shows "No courses found." when nothing matches', async () => {
    const { user, http } = await setup();
    http.expectOne(COURSES_API_URL).flush(SEED_COURSES);

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'zzz');

    expect(await screen.findByText('No courses found.')).toBeInTheDocument();
  });

  it('shows an error message when the API fails', async () => {
    const { http } = await setup();

    http
      .expectOne(COURSES_API_URL)
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(await screen.findByRole('alert')).toHaveTextContent('The server returned an error (500).');
  });

  it('opens the detail page when a course is clicked', async () => {
    const { user, http } = await setup();
    http.expectOne(COURSES_API_URL).flush(SEED_COURSES);

    await user.click(await screen.findByRole('button', { name: /Entity Framework Core in Action/ }));

    await waitFor(() => expect(TestBed.inject(Router).url).toBe('/courses/c-106'));
  });
});
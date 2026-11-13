import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { SEED_COURSES } from '../../testing/seed-courses';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  it('renders a row for every seeded course', async () => {
    await render(CourseListComponent, { inputs: { courses: SEED_COURSES } });

    const rows = within(screen.getByRole('list', { name: 'Courses' })).getAllByRole('listitem');
    expect(rows).toHaveLength(6);
    expect(screen.getByRole('button', { name: /TypeScript 5 Fundamentals/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entity Framework Core in Action/ })).toBeInTheDocument();
  });

  it('shows the level and duration of each course', async () => {
    await render(CourseListComponent, { inputs: { courses: SEED_COURSES } });

    expect(screen.getByRole('button', { name: /TypeScript 5 Fundamentals/ })).toHaveTextContent(
      'Beginner · 241 min',
    );
  });

  it('emits selected with the course id when a row is clicked', async () => {
    const selected = vi.fn();
    await render(CourseListComponent, {
      inputs: { courses: SEED_COURSES },
      on: { selected },
    });

    await userEvent.click(screen.getByRole('button', { name: /ASP.NET Core Web API Fundamentals/ }));

    expect(selected).toHaveBeenCalledTimes(1);
    expect(selected).toHaveBeenCalledWith('c-103');
  });

  it('shows an empty message when there are no courses', async () => {
    await render(CourseListComponent, { inputs: { courses: [] } });

    expect(screen.getByText('No courses found.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
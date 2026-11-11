import { render, screen } from '@testing-library/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('renders the CourseCompass heading', async () => {
    await render(AppComponent);

    expect(screen.getByRole('heading', { level: 1, name: 'CourseCompass' })).toBeInTheDocument();
  });
});
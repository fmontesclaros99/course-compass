import { COURSE_LEVELS, type CourseLevel } from './course.model';

describe('course.model', () => {
  it('lists the levels in display order', () => {
    expect(COURSE_LEVELS).toEqual(['beginner', 'intermediate', 'advanced']);
  });

  it('derives CourseLevel from COURSE_LEVELS', () => {
    const level: CourseLevel = 'advanced';
    // @ts-expect-error 'expert' is not in COURSE_LEVELS
    const invalid: CourseLevel = 'expert';
    expect(level).toBe('advanced');
    expect<string>(invalid).toBe('expert');
  });
});
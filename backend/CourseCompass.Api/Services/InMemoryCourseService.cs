using CourseCompass.Api.Data;
using CourseCompass.Api.Entities;
using CourseCompass.Api.Models;

namespace CourseCompass.Api.Services;

/// <summary>
/// Keeps courses in memory until EF Core arrives on Day 7. Registered as a singleton, so the lock
/// guards the list against concurrent requests. Data resets when the API restarts.
/// </summary>
public sealed class InMemoryCourseService : ICourseService
{
    private readonly object _gate = new();
    private readonly List<Course> _courses = SeedData.Courses.Select(Copy).ToList();

    public Task<IReadOnlyList<CourseDto>> GetCoursesAsync(CancellationToken cancellationToken = default)
    {
        lock (_gate)
        {
            IReadOnlyList<CourseDto> courses = _courses.Select(c => c.ToDto()).ToList();
            return Task.FromResult(courses);
        }
    }

    public Task<CourseDto?> GetCourseAsync(string id, CancellationToken cancellationToken = default)
    {
        lock (_gate)
        {
            return Task.FromResult(_courses.Find(c => c.Id == id)?.ToDto());
        }
    }

    public Task<CourseDto?> CreateCourseAsync(CreateCourseDto course, CancellationToken cancellationToken = default)
    {
        var title = course.Title.Trim();

        lock (_gate)
        {
            if (_courses.Exists(c => string.Equals(c.Title, title, StringComparison.OrdinalIgnoreCase)))
            {
                return Task.FromResult<CourseDto?>(null);
            }

            var created = new Course
            {
                Id = NextId(),
                Title = title,
                Level = course.Level,
                DurationMins = course.DurationMins,
                Author = course.Author.Trim(),
                Category = course.Category,
                Tags = [.. course.Tags],
            };
            _courses.Add(created);
            return Task.FromResult<CourseDto?>(created.ToDto());
        }
    }

    public Task<bool> DeleteCourseAsync(string id, CancellationToken cancellationToken = default)
    {
        lock (_gate)
        {
            return Task.FromResult(_courses.RemoveAll(c => c.Id == id) > 0);
        }
    }

    /// <summary>Ids follow the seed data's pattern: c-101, c-102, …</summary>
    private string NextId() => $"c-{_courses.Select(c => int.Parse(c.Id[2..])).DefaultIfEmpty(100).Max() + 1}";

    private static Course Copy(Course course) => new()
    {
        Id = course.Id,
        Title = course.Title,
        Level = course.Level,
        DurationMins = course.DurationMins,
        Author = course.Author,
        Category = course.Category,
        Tags = [.. course.Tags],
    };
}
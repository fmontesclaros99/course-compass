using CourseCompass.Api.Models;

namespace CourseCompass.Api.Services;

public interface ICourseService
{
    Task<IReadOnlyList<CourseDto>> GetCoursesAsync(CancellationToken cancellationToken = default);

    /// <returns>The course, or null if no course has this id.</returns>
    Task<CourseDto?> GetCourseAsync(string id, CancellationToken cancellationToken = default);

    /// <returns>The created course, or null if a course with the same title already exists.</returns>
    Task<CourseDto?> CreateCourseAsync(CreateCourseDto course, CancellationToken cancellationToken = default);

    /// <returns>True if the course was deleted, false if no course has this id.</returns>
    Task<bool> DeleteCourseAsync(string id, CancellationToken cancellationToken = default);
}
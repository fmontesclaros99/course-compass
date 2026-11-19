using CourseCompass.Api.Entities;

namespace CourseCompass.Api.Models;

public static class MappingExtensions
{
    public static CourseDto ToDto(this Course course) =>
        new(course.Id, course.Title, course.Level, course.DurationMins, course.Author, course.Category, [.. course.Tags]);

    public static CategoryDto ToDto(this Category category) => new(category.Slug, category.Label);
}
using System.ComponentModel.DataAnnotations;

namespace CourseCompass.Api.Models;

/// <summary>POST /api/courses. The server sets the id, so clients can't choose or overwrite one.</summary>
public sealed class CreateCourseDto
{
    [Required, StringLength(200)]
    public string Title { get; init; } = "";

    [Required]
    [AllowedValues("beginner", "intermediate", "advanced", ErrorMessage = "Level must be beginner, intermediate or advanced.")]
    public string Level { get; init; } = "";

    [Range(1, 10_000)]
    public int DurationMins { get; init; }

    [Required, StringLength(100)]
    public string Author { get; init; } = "";

    [Required, StringLength(50)]
    public string Category { get; init; } = "";

    [MaxLength(10)]
    public List<string> Tags { get; init; } = [];
}
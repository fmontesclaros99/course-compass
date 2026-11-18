namespace CourseCompass.Api.Entities;

/// <summary>A course as the API stores it. Clients never see this type; they get a <c>CourseDto</c>.</summary>
public sealed class Course
{
    public required string Id { get; init; }
    public required string Title { get; set; }
    public required string Level { get; set; }
    public int DurationMins { get; set; }
    public required string Author { get; set; }
    public required string Category { get; set; }
    public List<string> Tags { get; set; } = [];
}
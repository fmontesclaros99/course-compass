namespace CourseCompass.Api.Entities;

public sealed class Category
{
    public required string Slug { get; init; }
    public required string Label { get; set; }
}
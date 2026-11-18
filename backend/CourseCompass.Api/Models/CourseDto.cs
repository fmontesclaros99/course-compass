namespace CourseCompass.Api.Models;

/// <summary>GET /api/courses and GET /api/courses/{id}. Matches CourseDto in the frontend's api-contract.ts.</summary>
public sealed record CourseDto(
    string Id,
    string Title,
    string Level,
    int DurationMins,
    string Author,
    string Category,
    IReadOnlyList<string> Tags);
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CourseCompass.Api.Tests;

/// <summary>Starts the API in memory and sends real HTTP requests to it.</summary>
public class CoursesApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public CoursesApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCourses_returns_200()
    {
        var response = await _client.GetAsync("/api/courses");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCourse_returns_404_for_an_unknown_id()
    {
        var response = await _client.GetAsync("/api/courses/c-999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateCourse_returns_201_for_a_valid_course()
    {
        var course = new { title = "Testing ASP.NET Core APIs", level = "beginner", durationMins = 90, author = "Internal", category = "backend" };

        var response = await _client.PostAsJsonAsync("/api/courses", course);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);
    }

    [Fact]
    public async Task CreateCourse_returns_400_for_an_invalid_course()
    {
        var course = new { title = "", level = "expert", durationMins = 0, author = "Internal", category = "backend" };

        var response = await _client.PostAsJsonAsync("/api/courses", course);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateCourse_returns_409_for_a_duplicate_title()
    {
        var course = new { title = "TypeScript 5 Fundamentals", level = "beginner", durationMins = 90, author = "Internal", category = "language" };

        var response = await _client.PostAsJsonAsync("/api/courses", course);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task DeleteCourse_returns_204()
    {
        var response = await _client.DeleteAsync("/api/courses/c-106");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}
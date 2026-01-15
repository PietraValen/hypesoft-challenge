namespace Hypesoft.API.Middlewares;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Items["CorrelationId"]?.ToString() ?? "Unknown";
        var startTime = DateTime.UtcNow;

        _logger.LogInformation(
            "Request started. Method: {Method}, Path: {Path}, CorrelationId: {CorrelationId}",
            context.Request.Method,
            context.Request.Path,
            correlationId);

        await _next(context);

        var duration = DateTime.UtcNow - startTime;
        var statusCode = context.Response.StatusCode;

        _logger.LogInformation(
            "Request completed. Method: {Method}, Path: {Path}, StatusCode: {StatusCode}, Duration: {Duration}ms, CorrelationId: {CorrelationId}",
            context.Request.Method,
            context.Request.Path,
            statusCode,
            duration.TotalMilliseconds,
            correlationId);
    }
}

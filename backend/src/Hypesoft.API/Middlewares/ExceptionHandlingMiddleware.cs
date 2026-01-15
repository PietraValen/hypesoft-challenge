using Hypesoft.Application.DTOs.Common;
using Hypesoft.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace Hypesoft.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var correlationId = context.Items["CorrelationId"]?.ToString() ?? "Unknown";
        
        _logger.LogError(exception, 
            "An error occurred. CorrelationId: {CorrelationId}, Path: {Path}", 
            correlationId, context.Request.Path);

        var response = context.Response;
        response.ContentType = "application/json";

        int statusCode;
        string message;
        IEnumerable<string>? errors = null;

        if (exception is DomainException domainEx)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
            message = domainEx.Message;
        }
        else if (exception is BusinessRuleValidationException businessEx)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
            message = businessEx.Message;
        }
        else if (exception is KeyNotFoundException)
        {
            statusCode = (int)HttpStatusCode.NotFound;
            message = exception.Message;
        }
        else if (exception is ArgumentException)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
            message = exception.Message;
        }
        else if (exception is InvalidOperationException)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
            message = exception.Message;
        }
        else
        {
            statusCode = (int)HttpStatusCode.InternalServerError;
            message = "An error occurred while processing your request.";
        }

        response.StatusCode = statusCode;

        var errorResponse = ApiResponseDto<object>.ErrorResponse(message, errors);
        
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await response.WriteAsync(JsonSerializer.Serialize(errorResponse, jsonOptions));
    }
}

namespace Hypesoft.Application.DTOs.Common;

public class ApiResponseDto<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static ApiResponseDto<T> SuccessResponse(T data, string? message = null)
    {
        return new ApiResponseDto<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponseDto<T> ErrorResponse(string message, IEnumerable<string>? errors = null)
    {
        return new ApiResponseDto<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}

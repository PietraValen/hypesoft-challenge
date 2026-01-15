namespace Hypesoft.Application.DTOs.Dashboard;

public class CategoryProductCountDto
{
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}

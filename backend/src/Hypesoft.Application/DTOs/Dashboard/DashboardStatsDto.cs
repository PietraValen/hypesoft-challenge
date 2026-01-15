namespace Hypesoft.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalProducts { get; set; }
    public decimal TotalStockValue { get; set; }
    public string Currency { get; set; } = "BRL";
    public int LowStockProductsCount { get; set; }
    public int OutOfStockProductsCount { get; set; }
    public int TotalCategories { get; set; }
}

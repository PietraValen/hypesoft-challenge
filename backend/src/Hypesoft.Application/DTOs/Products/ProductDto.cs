using Hypesoft.Domain.Enums;

namespace Hypesoft.Application.DTOs.Products;

public class ProductDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "BRL";
    public string CategoryId { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public int StockQuantity { get; set; }
    public bool IsLowStock { get; set; }
    public bool IsOutOfStock { get; set; }
    public ProductStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

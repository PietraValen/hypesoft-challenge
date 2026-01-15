using Hypesoft.Domain.Enums;

namespace Hypesoft.Application.DTOs.Products;

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "BRL";
    public string CategoryId { get; set; } = string.Empty;
    public ProductStatus? Status { get; set; }
}

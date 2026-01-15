using Hypesoft.Application.DTOs.Products;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "BRL";
    public string CategoryId { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}

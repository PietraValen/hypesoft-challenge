using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Enums;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public class UpdateProductCommand : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "BRL";
    public string CategoryId { get; set; } = string.Empty;
    public ProductStatus? Status { get; set; }
}

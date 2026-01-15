using Hypesoft.Application.DTOs.Products;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public class UpdateStockCommand : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

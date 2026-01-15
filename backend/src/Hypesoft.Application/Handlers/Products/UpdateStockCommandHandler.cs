using AutoMapper;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class UpdateStockCommandHandler : IRequestHandler<UpdateStockCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public UpdateStockCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(UpdateStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {request.Id} not found");
        }

        product.UpdateStock(request.Quantity);
        await _productRepository.UpdateAsync(product, cancellationToken);

        // Get category name for DTO
        var category = await _categoryRepository.GetByIdAsync(product.CategoryId, cancellationToken);
        var productDto = _mapper.Map<ProductDto>(product);
        if (category != null)
        {
            productDto.CategoryName = category.Name;
        }

        return productDto;
    }
}

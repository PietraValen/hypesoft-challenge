using AutoMapper;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {request.Id} not found");
        }

        // Validate category exists
        var categoryExists = await _categoryRepository.ExistsAsync(request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new InvalidOperationException($"Category with ID {request.CategoryId} does not exist");
        }

        product.Update(
            request.Name,
            new Domain.ValueObjects.Money(request.Price, request.Currency),
            request.CategoryId,
            request.Description,
            request.Status);

        await _productRepository.UpdateAsync(product, cancellationToken);

        // Get category name for DTO
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        var productDto = _mapper.Map<ProductDto>(product);
        if (category != null)
        {
            productDto.CategoryName = category.Name;
        }

        return productDto;
    }
}

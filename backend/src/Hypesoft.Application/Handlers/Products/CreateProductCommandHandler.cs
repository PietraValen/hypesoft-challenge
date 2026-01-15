using AutoMapper;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Validate category exists
        var categoryExists = await _categoryRepository.ExistsAsync(request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new InvalidOperationException($"Category with ID {request.CategoryId} does not exist");
        }

        var product = new Product(
            request.Name,
            new Money(request.Price, request.Currency),
            request.CategoryId,
            new StockQuantity(request.StockQuantity),
            request.Description);

        var createdProduct = await _productRepository.AddAsync(product, cancellationToken);

        // Get category name for DTO
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        var productDto = _mapper.Map<ProductDto>(createdProduct);
        if (category != null)
        {
            productDto.CategoryName = category.Name;
        }

        return productDto;
    }
}

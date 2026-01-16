using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class GetProductByIdQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public GetProductByIdQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidId_ShouldReturnProduct()
    {
        // Arrange
        var productId = "product123";
        var categoryId = "category123";
        var query = new GetProductByIdQuery { Id = productId };

        var product = new Product(
            "Test Product",
            new Money(100m, "BRL"),
            categoryId,
            new StockQuantity(10),
            "Description");

        var category = new Category("Test Category", "Description");

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetProductByIdQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(product.Id);
        result.Name.Should().Be(product.Name);
        result.CategoryName.Should().Be(category.Name);
    }

    [Fact]
    public async Task Handle_WithNonExistentId_ShouldReturnNull()
    {
        // Arrange
        var productId = "nonexistent";
        var query = new GetProductByIdQuery { Id = productId };

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new GetProductByIdQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();
    }
}

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

public class GetLowStockProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public GetLowStockProductsQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_ShouldReturnProductsWithLowStock()
    {
        // Arrange
        var query = new GetLowStockProductsQuery();

        var products = new List<Product>
        {
            new Product("Product 1", new Money(100m, "BRL"), "cat1", new StockQuantity(5)), // Low stock
            new Product("Product 2", new Money(200m, "BRL"), "cat1", new StockQuantity(3))  // Low stock
        };

        var category = new Category("Category 1", "Description");

        _productRepositoryMock
            .Setup(x => x.GetLowStockProductsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync("cat1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetLowStockProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.All(p => p.StockQuantity < 10).Should().BeTrue();
    }
}

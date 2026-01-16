using FluentAssertions;
using Hypesoft.Application.Handlers.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Dashboard;

public class GetDashboardStatsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;

    public GetDashboardStatsQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();
    }

    [Fact]
    public async Task Handle_ShouldReturnDashboardStats()
    {
        // Arrange
        var query = new GetDashboardStatsQuery();

        var products = new List<Domain.Entities.Product>
        {
            new Domain.Entities.Product("Product 1", new Money(100m, "BRL"), "cat1", new StockQuantity(5)), // Low stock
            new Domain.Entities.Product("Product 2", new Money(200m, "BRL"), "cat1", new StockQuantity(0)), // Out of stock
            new Domain.Entities.Product("Product 3", new Money(150m, "BRL"), "cat2", new StockQuantity(20)) // Normal stock
        };

        var categories = new List<Category>
        {
            new Category("Category 1", "Description"),
            new Category("Category 2", "Description")
        };

        _productRepositoryMock
            .Setup(x => x.CountAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(products.Count);

        _categoryRepositoryMock
            .Setup(x => x.CountAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories.Count);

        _productRepositoryMock
            .Setup(x => x.GetLowStockProductsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(products.Where(p => p.StockQuantity.Quantity < 10));

        _productRepositoryMock
            .Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        var handler = new GetDashboardStatsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TotalProducts.Should().Be(3);
        result.TotalCategories.Should().Be(2);
        result.LowStockProductsCount.Should().Be(1); // Product 1 with stock 5
        result.OutOfStockProductsCount.Should().Be(1); // Product 2 with stock 0
        result.Currency.Should().Be("BRL");
        result.TotalStockValue.Should().BeGreaterThan(0);
    }
}

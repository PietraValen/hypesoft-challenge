using FluentAssertions;
using Hypesoft.Application.Handlers.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using System.Reflection;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Dashboard;

public class GetProductsByCategoryQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;

    public GetProductsByCategoryQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();
    }

    [Fact]
    public async Task Handle_ShouldReturnProductsGroupedByCategory()
    {
        // Arrange
        var query = new GetProductsByCategoryQuery();

        // Note: IDs serão gerados pelo MongoDB em produção, mas para testes usamos mocks
        // que podem retornar entidades com IDs específicos via reflexão ou criação especial
        var cat1 = new Category("Category 1", "Description");
        var cat2 = new Category("Category 2", "Description");
        var cat3 = new Category("Category 3", "Description");
        
        // Usar reflexão para definir IDs de teste
        typeof(Category).GetProperty("Id")!.SetValue(cat1, "cat1");
        typeof(Category).GetProperty("Id")!.SetValue(cat2, "cat2");
        typeof(Category).GetProperty("Id")!.SetValue(cat3, "cat3");

        var categories = new List<Category> { cat1, cat2, cat3 };

        var products = new List<Domain.Entities.Product>
        {
            new Domain.Entities.Product("Product 1", new Money(100m, "BRL"), "cat1", new StockQuantity(10)),
            new Domain.Entities.Product("Product 2", new Money(200m, "BRL"), "cat1", new StockQuantity(20)),
            new Domain.Entities.Product("Product 3", new Money(150m, "BRL"), "cat2", new StockQuantity(15)),
            // Category 3 has no products
        };

        _categoryRepositoryMock
            .Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        _productRepositoryMock
            .Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        var handler = new GetProductsByCategoryQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        
        var cat1Result = result.First(r => r.CategoryId == "cat1");
        cat1Result.ProductCount.Should().Be(2);
        cat1Result.CategoryName.Should().Be("Category 1");

        var cat2Result = result.First(r => r.CategoryId == "cat2");
        cat2Result.ProductCount.Should().Be(1);
        cat2Result.CategoryName.Should().Be("Category 2");

        var cat3Result = result.First(r => r.CategoryId == "cat3");
        cat3Result.ProductCount.Should().Be(0);
        cat3Result.CategoryName.Should().Be("Category 3");
    }
}

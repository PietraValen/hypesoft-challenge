using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Categories;

public class DeleteCategoryCommandHandlerTests
{
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly Mock<IProductRepository> _productRepositoryMock;

    public DeleteCategoryCommandHandlerTests()
    {
        _categoryRepositoryMock = new Mock<ICategoryRepository>();
        _productRepositoryMock = new Mock<IProductRepository>();
    }

    [Fact]
    public async Task Handle_WithValidId_ShouldDeleteCategory()
    {
        // Arrange
        var categoryId = "category123";
        var command = new DeleteCategoryCommand { Id = categoryId };

        var existingCategory = new Category("Test Category", "Description");

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingCategory);

        _productRepositoryMock
            .Setup(x => x.GetByCategoryIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Enumerable.Empty<Domain.Entities.Product>());

        _categoryRepositoryMock
            .Setup(x => x.DeleteAsync(categoryId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new DeleteCategoryCommandHandler(_categoryRepositoryMock.Object, _productRepositoryMock.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        _categoryRepositoryMock.Verify(x => x.DeleteAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentId_ShouldThrowException()
    {
        // Arrange
        var categoryId = "nonexistent";
        var command = new DeleteCategoryCommand { Id = categoryId };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var handler = new DeleteCategoryCommandHandler(_categoryRepositoryMock.Object, _productRepositoryMock.Object);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));

        _categoryRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WithCategoryInUse_ShouldThrowException()
    {
        // Arrange
        var categoryId = "category123";
        var command = new DeleteCategoryCommand { Id = categoryId };

        var existingCategory = new Category("Test Category", "Description");
        var products = new List<Domain.Entities.Product>
        {
            new Domain.Entities.Product("Product 1", new Domain.ValueObjects.Money(100m, "BRL"), categoryId, new Domain.ValueObjects.StockQuantity(10))
        };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingCategory);

        _productRepositoryMock
            .Setup(x => x.GetByCategoryIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        var handler = new DeleteCategoryCommandHandler(_categoryRepositoryMock.Object, _productRepositoryMock.Object);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(command, CancellationToken.None));

        _categoryRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}

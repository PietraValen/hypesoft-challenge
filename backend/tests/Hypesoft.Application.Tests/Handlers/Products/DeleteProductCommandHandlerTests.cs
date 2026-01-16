using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class DeleteProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;

    public DeleteProductCommandHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
    }

    [Fact]
    public async Task Handle_WithValidId_ShouldDeleteProduct()
    {
        // Arrange
        var productId = "product123";
        var command = new DeleteProductCommand { Id = productId };

        var existingProduct = new Product(
            "Test Product",
            new Money(100m, "BRL"),
            "category123",
            new StockQuantity(10),
            "Description");

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        _productRepositoryMock
            .Setup(x => x.DeleteAsync(productId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new DeleteProductCommandHandler(_productRepositoryMock.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        _productRepositoryMock.Verify(x => x.DeleteAsync(productId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentId_ShouldThrowException()
    {
        // Arrange
        var productId = "nonexistent";
        var command = new DeleteProductCommand { Id = productId };

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new DeleteProductCommandHandler(_productRepositoryMock.Object);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));

        _productRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}

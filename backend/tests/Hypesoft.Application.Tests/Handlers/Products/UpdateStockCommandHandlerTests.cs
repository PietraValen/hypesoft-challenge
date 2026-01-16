using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class UpdateStockCommandHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public UpdateStockCommandHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldUpdateStock()
    {
        // Arrange
        var productId = "product123";
        var categoryId = "category123";
        var newQuantity = 50;
        var command = new UpdateStockCommand
        {
            Id = productId,
            Quantity = newQuantity
        };

        var existingProduct = new Product(
            "Test Product",
            new Money(100m, "BRL"),
            categoryId,
            new StockQuantity(10),
            "Description");

        var category = new Category("Test Category", "Description");

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _productRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new UpdateStockCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.StockQuantity.Should().Be(newQuantity);
        _productRepositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentProduct_ShouldThrowException()
    {
        // Arrange
        var productId = "nonexistent";
        var command = new UpdateStockCommand
        {
            Id = productId,
            Quantity = 50
        };

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new UpdateStockCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));
    }
}

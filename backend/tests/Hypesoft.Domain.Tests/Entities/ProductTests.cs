using FluentAssertions;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Exceptions;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.Domain.Tests.Entities;

public class ProductTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateProduct()
    {
        // Arrange
        var name = "Test Product";
        var price = new Money(100.50m, "BRL");
        var categoryId = "category123";
        var stockQuantity = new StockQuantity(10);
        var description = "Test Description";

        // Act
        var product = new Product(name, price, categoryId, stockQuantity, description);

        // Assert
        product.Name.Should().Be(name);
        product.Price.Should().Be(price);
        product.CategoryId.Should().Be(categoryId);
        product.StockQuantity.Should().Be(stockQuantity);
        product.Description.Should().Be(description);
        product.Status.Should().Be(ProductStatus.Active);
        // Id será gerado pelo MongoDB quando salvo
    }

    [Fact]
    public void Constructor_WithEmptyName_ShouldThrowException()
    {
        // Arrange
        var price = new Money(100m, "BRL");
        var categoryId = "category123";
        var stockQuantity = new StockQuantity(10);

        // Act & Assert
        Assert.Throws<BusinessRuleValidationException>(() => 
            new Product("", price, categoryId, stockQuantity));
    }

    [Fact]
    public void UpdateStock_WithValidQuantity_ShouldUpdateStock()
    {
        // Arrange
        var product = CreateValidProduct();
        var newQuantity = 20;

        // Act
        product.UpdateStock(newQuantity);

        // Assert
        product.StockQuantity.Quantity.Should().Be(newQuantity);
    }

    [Fact]
    public void AddStock_WithValidQuantity_ShouldIncreaseStock()
    {
        // Arrange
        var product = CreateValidProduct();
        var initialStock = product.StockQuantity.Quantity;
        var quantityToAdd = 5;

        // Act
        product.AddStock(quantityToAdd);

        // Assert
        product.StockQuantity.Quantity.Should().Be(initialStock + quantityToAdd);
    }

    [Fact]
    public void RemoveStock_WithValidQuantity_ShouldDecreaseStock()
    {
        // Arrange
        var product = CreateValidProduct();
        var initialStock = product.StockQuantity.Quantity;
        var quantityToRemove = 3;

        // Act
        product.RemoveStock(quantityToRemove);

        // Assert
        product.StockQuantity.Quantity.Should().Be(initialStock - quantityToRemove);
    }

    [Fact]
    public void RemoveStock_WithInsufficientStock_ShouldThrowException()
    {
        // Arrange
        var product = CreateValidProduct();
        var quantityToRemove = product.StockQuantity.Quantity + 10;

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => 
            product.RemoveStock(quantityToRemove));
    }

    [Fact]
    public void IsLowStock_WithStockBelow10_ShouldReturnTrue()
    {
        // Arrange
        var product = CreateValidProduct();
        product.UpdateStock(5);

        // Act
        var result = product.IsLowStock();

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void IsLowStock_WithStockAbove10_ShouldReturnFalse()
    {
        // Arrange
        var product = CreateValidProduct();
        product.UpdateStock(15);

        // Act
        var result = product.IsLowStock();

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void MarkAsInactive_ShouldChangeStatusToInactive()
    {
        // Arrange
        var product = CreateValidProduct();

        // Act
        product.MarkAsInactive();

        // Assert
        product.Status.Should().Be(ProductStatus.Inactive);
    }

    [Fact]
    public void MarkAsDiscontinued_ShouldChangeStatusToDiscontinued()
    {
        // Arrange
        var product = CreateValidProduct();

        // Act
        product.MarkAsDiscontinued();

        // Assert
        product.Status.Should().Be(ProductStatus.Discontinued);
    }

    private Product CreateValidProduct()
    {
        return new Product(
            "Test Product",
            new Money(100m, "BRL"),
            "category123",
            new StockQuantity(10),
            "Test Description");
    }
}

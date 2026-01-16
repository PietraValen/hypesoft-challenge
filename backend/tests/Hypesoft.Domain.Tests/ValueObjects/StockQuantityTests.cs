using FluentAssertions;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.Domain.Tests.ValueObjects;

public class StockQuantityTests
{
    [Fact]
    public void Constructor_WithValidQuantity_ShouldCreateStockQuantity()
    {
        // Arrange & Act
        var stock = new StockQuantity(10);

        // Assert
        stock.Quantity.Should().Be(10);
    }

    [Fact]
    public void Constructor_WithNegativeQuantity_ShouldThrowException()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new StockQuantity(-1));
    }

    [Fact]
    public void IsLowStock_WithQuantityBelow10_ShouldReturnTrue()
    {
        // Arrange
        var stock = new StockQuantity(5);

        // Act & Assert
        stock.IsLowStock.Should().BeTrue();
    }

    [Fact]
    public void IsLowStock_WithQuantity10OrAbove_ShouldReturnFalse()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act & Assert
        stock.IsLowStock.Should().BeFalse();
    }

    [Fact]
    public void IsOutOfStock_WithZeroQuantity_ShouldReturnTrue()
    {
        // Arrange
        var stock = new StockQuantity(0);

        // Act & Assert
        stock.IsOutOfStock.Should().BeTrue();
    }

    [Fact]
    public void Add_WithValidAmount_ShouldIncreaseQuantity()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act
        var result = stock.Add(5);

        // Assert
        result.Quantity.Should().Be(15);
    }

    [Fact]
    public void Subtract_WithValidAmount_ShouldDecreaseQuantity()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act
        var result = stock.Subtract(3);

        // Assert
        result.Quantity.Should().Be(7);
    }

    [Fact]
    public void Subtract_WithInsufficientStock_ShouldThrowException()
    {
        // Arrange
        var stock = new StockQuantity(5);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => stock.Subtract(10));
    }
}

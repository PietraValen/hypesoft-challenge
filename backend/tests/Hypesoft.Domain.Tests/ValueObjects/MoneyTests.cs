using FluentAssertions;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.Domain.Tests.ValueObjects;

public class MoneyTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateMoney()
    {
        // Arrange & Act
        var money = new Money(100.50m, "BRL");

        // Assert
        money.Amount.Should().Be(100.50m);
        money.Currency.Should().Be("BRL");
    }

    [Fact]
    public void Constructor_WithNegativeAmount_ShouldThrowException()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Money(-10m, "BRL"));
    }

    [Fact]
    public void Constructor_WithEmptyCurrency_ShouldThrowException()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Money(100m, ""));
    }

    [Fact]
    public void Zero_ShouldReturnZeroAmount()
    {
        // Act
        var money = Money.Zero("BRL");

        // Assert
        money.Amount.Should().Be(0m);
        money.Currency.Should().Be("BRL");
    }

    [Fact]
    public void Add_WithSameCurrency_ShouldAddAmounts()
    {
        // Arrange
        var money1 = new Money(100m, "BRL");
        var money2 = new Money(50m, "BRL");

        // Act
        var result = money1 + money2;

        // Assert
        result.Amount.Should().Be(150m);
        result.Currency.Should().Be("BRL");
    }

    [Fact]
    public void Add_WithDifferentCurrencies_ShouldThrowException()
    {
        // Arrange
        var money1 = new Money(100m, "BRL");
        var money2 = new Money(50m, "USD");

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => money1 + money2);
    }

    [Fact]
    public void Subtract_WithSameCurrency_ShouldSubtractAmounts()
    {
        // Arrange
        var money1 = new Money(100m, "BRL");
        var money2 = new Money(30m, "BRL");

        // Act
        var result = money1 - money2;

        // Assert
        result.Amount.Should().Be(70m);
        result.Currency.Should().Be("BRL");
    }
}

using FluentAssertions;
using FluentValidation.TestHelper;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Validators.Products;

namespace Hypesoft.Application.Tests.Validators.Products;

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator;

    public CreateProductCommandValidatorTests()
    {
        _validator = new CreateProductCommandValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Valid Product",
            Price = 100.50m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = 10
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_ShouldFail()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "",
            Price = 100m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = 10
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithNegativePrice_ShouldFail()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Product",
            Price = -10m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = 10
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Price);
    }

    [Fact]
    public void Validate_WithEmptyCategoryId_ShouldFail()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Product",
            Price = 100m,
            Currency = "BRL",
            CategoryId = "",
            StockQuantity = 10
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CategoryId);
    }

    [Fact]
    public void Validate_WithNegativeStockQuantity_ShouldFail()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Product",
            Price = 100m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = -1
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.StockQuantity);
    }
}

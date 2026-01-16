using FluentAssertions;
using FluentValidation.TestHelper;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Validators.Categories;

namespace Hypesoft.Application.Tests.Validators.Categories;

public class CreateCategoryCommandValidatorTests
{
    private readonly CreateCategoryCommandValidator _validator;

    public CreateCategoryCommandValidatorTests()
    {
        _validator = new CreateCategoryCommandValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Valid Category",
            Description = "Description"
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
        var command = new CreateCategoryCommand
        {
            Name = "",
            Description = "Description"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
}

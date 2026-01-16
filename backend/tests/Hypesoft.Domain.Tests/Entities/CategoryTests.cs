using FluentAssertions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Tests.Entities;

public class CategoryTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateCategory()
    {
        // Arrange
        var name = "Test Category";
        var description = "Test Description";

        // Act
        var category = new Category(name, description);

        // Assert
        category.Name.Should().Be(name);
        category.Description.Should().Be(description);
        // Id será gerado pelo MongoDB quando salvo
    }

    [Fact]
    public void Constructor_WithEmptyName_ShouldThrowException()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Category("", "Description"));
    }

    [Fact]
    public void Update_WithValidData_ShouldUpdateCategory()
    {
        // Arrange
        var category = new Category("Old Name", "Old Description");
        var newName = "New Name";
        var newDescription = "New Description";

        // Act
        category.Update(newName, newDescription);

        // Assert
        category.Name.Should().Be(newName);
        category.Description.Should().Be(newDescription);
    }

    [Fact]
    public void Update_WithEmptyName_ShouldThrowException()
    {
        // Arrange
        var category = new Category("Valid Name", "Description");

        // Act & Assert
        Assert.Throws<ArgumentException>(() => category.Update("", "Description"));
    }
}

using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Exceptions;
using Hypesoft.Domain.ValueObjects;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hypesoft.Domain.Entities;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Money Price { get; private set; } = null!;
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoryId { get; private set; } = string.Empty;

    public StockQuantity StockQuantity { get; private set; } = null!;
    public ProductStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    [BsonConstructor]
    public Product(
        string name,
        Money price,
        string categoryId,
        StockQuantity stockQuantity,
        string? description = null,
        ProductStatus status = ProductStatus.Active)
    {
        ValidateName(name);
        ValidateCategoryId(categoryId);

        Name = name.Trim();
        Description = description?.Trim();
        Price = price ?? throw new ArgumentNullException(nameof(price));
        CategoryId = categoryId;
        StockQuantity = stockQuantity ?? throw new ArgumentNullException(nameof(stockQuantity));
        Status = status;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string name,
        Money price,
        string categoryId,
        string? description = null,
        ProductStatus? status = null)
    {
        ValidateName(name);
        ValidateCategoryId(categoryId);

        Name = name.Trim();
        Description = description?.Trim();
        Price = price ?? throw new ArgumentNullException(nameof(price));
        CategoryId = categoryId;
        
        if (status.HasValue)
            Status = status.Value;

        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(int newQuantity)
    {
        StockQuantity = StockQuantity.Update(newQuantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddStock(int quantity)
    {
        if (quantity <= 0)
            throw new BusinessRuleValidationException("Quantity to add must be greater than zero");

        StockQuantity = StockQuantity.Add(quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveStock(int quantity)
    {
        if (quantity <= 0)
            throw new BusinessRuleValidationException("Quantity to remove must be greater than zero");

        StockQuantity = StockQuantity.Subtract(quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsLowStock() => StockQuantity.IsLowStock;

    public bool IsOutOfStock() => StockQuantity.IsOutOfStock;

    public void MarkAsInactive()
    {
        Status = ProductStatus.Inactive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsDiscontinued()
    {
        Status = ProductStatus.Discontinued;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Product name cannot be null or empty");

        if (name.Length > 200)
            throw new BusinessRuleValidationException("Product name cannot exceed 200 characters");
    }

    private static void ValidateCategoryId(string categoryId)
    {
        if (string.IsNullOrWhiteSpace(categoryId))
            throw new BusinessRuleValidationException("Category ID cannot be null or empty");
    }
}

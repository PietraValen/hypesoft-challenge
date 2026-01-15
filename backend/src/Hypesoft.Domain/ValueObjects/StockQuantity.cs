using MongoDB.Bson.Serialization.Attributes;

namespace Hypesoft.Domain.ValueObjects;

public class StockQuantity
{
    private const int LowStockThreshold = 10;

    public int Quantity { get; private set; }
    public bool IsLowStock => Quantity < LowStockThreshold;
    public bool IsOutOfStock => Quantity == 0;

    [BsonConstructor]
    public StockQuantity(int quantity)
    {
        if (quantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(quantity));

        Quantity = quantity;
    }

    public static StockQuantity Zero => new(0);

    public StockQuantity Add(int amount)
    {
        if (amount < 0)
            throw new ArgumentException("Amount to add cannot be negative", nameof(amount));

        return new StockQuantity(Quantity + amount);
    }

    public StockQuantity Subtract(int amount)
    {
        if (amount < 0)
            throw new ArgumentException("Amount to subtract cannot be negative", nameof(amount));

        if (Quantity < amount)
            throw new InvalidOperationException("Insufficient stock");

        return new StockQuantity(Quantity - amount);
    }

    public StockQuantity Update(int newQuantity)
    {
        return new StockQuantity(newQuantity);
    }

    public override bool Equals(object? obj)
    {
        if (obj is not StockQuantity other)
            return false;

        return Quantity == other.Quantity;
    }

    public override int GetHashCode()
    {
        return Quantity.GetHashCode();
    }
}

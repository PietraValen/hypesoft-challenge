using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.DomainEvents;

public class ProductStockLowEvent
{
    public Product Product { get; }
    public int CurrentStock { get; }
    public DateTime OccurredOn { get; }

    public ProductStockLowEvent(Product product, int currentStock)
    {
        Product = product;
        CurrentStock = currentStock;
        OccurredOn = DateTime.UtcNow;
    }
}

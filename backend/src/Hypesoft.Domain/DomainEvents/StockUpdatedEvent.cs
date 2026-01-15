using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.DomainEvents;

public class StockUpdatedEvent
{
    public Product Product { get; }
    public int PreviousStock { get; }
    public int NewStock { get; }
    public DateTime OccurredOn { get; }

    public StockUpdatedEvent(Product product, int previousStock, int newStock)
    {
        Product = product;
        PreviousStock = previousStock;
        NewStock = newStock;
        OccurredOn = DateTime.UtcNow;
    }
}

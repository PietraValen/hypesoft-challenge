using AutoMapper;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Categories;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Product mappings
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price.Amount))
            .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Price.Currency))
            .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity.Quantity))
            .ForMember(dest => dest.IsLowStock, opt => opt.MapFrom(src => src.StockQuantity.IsLowStock))
            .ForMember(dest => dest.IsOutOfStock, opt => opt.MapFrom(src => src.StockQuantity.IsOutOfStock));

        CreateMap<CreateProductCommand, Product>()
            .ConstructUsing(cmd => new Product(
                cmd.Name,
                new Money(cmd.Price, cmd.Currency),
                cmd.CategoryId,
                new StockQuantity(cmd.StockQuantity),
                cmd.Description ?? string.Empty,
                Domain.Enums.ProductStatus.Active));

        // Category mappings
        CreateMap<Category, CategoryDto>();

        CreateMap<CreateCategoryCommand, Category>()
            .ConstructUsing(cmd => new Category(cmd.Name, cmd.Description ?? string.Empty));

    }
}

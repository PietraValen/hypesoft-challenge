using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of products
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponseDto<PagedResultDto<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? categoryId = null,
        [FromQuery] Domain.Enums.ProductStatus? status = null)
    {
        var query = new GetProductsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize > 100 ? 100 : pageSize, // Max page size
            CategoryId = categoryId,
            Status = status
        };

        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<PagedResultDto<ProductDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProductById(string id)
    {
        var query = new GetProductByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound(ApiResponseDto<ProductDto>.ErrorResponse("Product not found"));
        }

        return Ok(ApiResponseDto<ProductDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Search products by name
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchProducts([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return BadRequest(ApiResponseDto<ProductDto>.ErrorResponse("Search term is required"));
        }

        var query = new SearchProductsQuery { SearchTerm = q };
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<ProductDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get products with low stock
    /// </summary>
    [HttpGet("low-stock")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLowStockProducts()
    {
        var query = new GetLowStockProductsQuery();
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<ProductDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponseDto<ProductDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var command = new CreateProductCommand
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Currency = dto.Currency,
            CategoryId = dto.CategoryId,
            StockQuantity = dto.StockQuantity
        };

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, 
            ApiResponseDto<ProductDto>.SuccessResponse(result, "Product created successfully"));
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductDto dto)
    {
        var command = new UpdateProductCommand
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Currency = dto.Currency,
            CategoryId = dto.CategoryId,
            Status = dto.Status
        };

        try
        {
            var result = await _mediator.Send(command);
            return Ok(ApiResponseDto<ProductDto>.SuccessResponse(result, "Product updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponseDto<ProductDto>.ErrorResponse("Product not found"));
        }
    }

    /// <summary>
    /// Update product stock
    /// </summary>
    [HttpPut("{id}/stock")]
    [ProducesResponseType(typeof(ApiResponseDto<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStock(string id, [FromBody] UpdateStockDto dto)
    {
        var command = new UpdateStockCommand
        {
            Id = id,
            Quantity = dto.Quantity
        };

        try
        {
            var result = await _mediator.Send(command);
            return Ok(ApiResponseDto<ProductDto>.SuccessResponse(result, "Stock updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponseDto<ProductDto>.ErrorResponse("Product not found"));
        }
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var command = new DeleteProductCommand { Id = id };

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponseDto<ProductDto>.ErrorResponse("Product not found"));
        }
    }
}

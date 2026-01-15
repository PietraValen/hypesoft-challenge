using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.DTOs.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IMediator mediator, ILogger<DashboardController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard statistics
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponseDto<DashboardStatsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardStats()
    {
        var query = new GetDashboardStatsQuery();
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<DashboardStatsDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Get products with low stock
    /// </summary>
    [HttpGet("low-stock")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<Hypesoft.Application.DTOs.Products.ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLowStockProducts()
    {
        var query = new Hypesoft.Application.Queries.Products.GetLowStockProductsQuery();
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<Hypesoft.Application.DTOs.Products.ProductDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get product count by category
    /// </summary>
    [HttpGet("products-by-category")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<CategoryProductCountDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProductsByCategory()
    {
        var query = new GetProductsByCategoryQuery();
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<CategoryProductCountDto>>.SuccessResponse(result));
    }
}

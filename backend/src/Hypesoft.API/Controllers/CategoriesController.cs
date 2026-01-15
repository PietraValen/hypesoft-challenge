using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs.Categories;
using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(IMediator mediator, ILogger<CategoriesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all categories
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories()
    {
        var query = new GetCategoriesQuery();
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<CategoryDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get category by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategoryById(string id)
    {
        var query = new GetCategoryByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound(ApiResponseDto<CategoryDto>.ErrorResponse("Category not found"));
        }

        return Ok(ApiResponseDto<CategoryDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Get products by category ID
    /// </summary>
    [HttpGet("{id}/products")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<Hypesoft.Application.DTOs.Products.ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProductsByCategory(string id)
    {
        var query = new Hypesoft.Application.Queries.Products.GetProductsQuery
        {
            CategoryId = id,
            PageNumber = 1,
            PageSize = 1000
        };
        var result = await _mediator.Send(query);
        return Ok(ApiResponseDto<IEnumerable<Hypesoft.Application.DTOs.Products.ProductDto>>.SuccessResponse(result.Items));
    }

    /// <summary>
    /// Create a new category
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponseDto<CategoryDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var command = new CreateCategoryCommand
        {
            Name = dto.Name,
            Description = dto.Description
        };

        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetCategoryById), new { id = result.Id },
                ApiResponseDto<CategoryDto>.SuccessResponse(result, "Category created successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponseDto<CategoryDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Update an existing category
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] UpdateCategoryDto dto)
    {
        var command = new UpdateCategoryCommand
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description
        };

        try
        {
            var result = await _mediator.Send(command);
            return Ok(ApiResponseDto<CategoryDto>.SuccessResponse(result, "Category updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponseDto<CategoryDto>.ErrorResponse("Category not found"));
        }
    }

    /// <summary>
    /// Delete a category
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var command = new DeleteCategoryCommand { Id = id };

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponseDto<CategoryDto>.ErrorResponse("Category not found"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponseDto<CategoryDto>.ErrorResponse(ex.Message));
        }
    }
}

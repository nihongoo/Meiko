using API.DTO;
using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductDetailController : ControllerBase
    {
        private readonly IProductDetailServices _productDetailService;

        public ProductDetailController(IProductDetailServices productDetailService)
        {
            _productDetailService = productDetailService;
        }
        [HttpGet("Get-All")]
        public async Task<ActionResult<IEnumerable<ProductDetails>>> GetProductDetails()
        {
            var productDetails = await _productDetailService.GetAllAsync();
            return Ok(productDetails);
        }
        [HttpGet("Product/{id}")]
        public async Task<IActionResult> GetDetails(Guid id)
        {
            var result = await _productDetailService.GetDetailsAsync(id);
            if (result == null) { return NotFound(); }
            return Ok(result);
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<ProductDetails>> GetProductDetail(Guid id)
        {
            var productDetail = await _productDetailService.GetByIdAsync(id);
            if (productDetail == null) return NotFound();
            return Ok(productDetail);
        }

        [HttpPost("Create")]
        public async Task<ActionResult> CreateProductDetail([FromBody] ProductDetailViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productDetailService.CreateAsync(model);
            return Ok();
        }

        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateProductDetail([FromBody] ProductDetailDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productDetailService.UpdateAsync( model);
            return NoContent();
        }

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteProductDetail(Guid id)
        {
            await _productDetailService.DeleteAsync(id);
            return NoContent();
        }
    }
}

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDetails>>> GetProductDetails()
        {
            var productDetails = await _productDetailService.GetAllAsync();
            return Ok(productDetails);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDetails>> GetProductDetail(Guid id)
        {
            var productDetail = await _productDetailService.GetByIdAsync(id);
            if (productDetail == null) return NotFound();
            return Ok(productDetail);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProductDetail([FromBody] ProductDetailViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productDetailService.CreateAsync(model);
            return CreatedAtAction(nameof(GetProductDetail), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProductDetail(Guid id, [FromBody] ProductDetailViewModel model)
        {
            if (id != model.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productDetailService.UpdateAsync(model);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProductDetail(Guid id)
        {
            await _productDetailService.DeleteAsync(id);
            return NoContent();
        }
    }
}

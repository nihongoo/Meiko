using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IProductServices _productServices;
        public ProductController(IProductServices productServices)
        {
            _productServices = productServices;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> GetProducts()
        {
            var products = await _productServices.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetProduct(Guid id)
        {
            var product = await _productServices.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProduct([FromBody] ProductViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productServices.CreateAsync(model);
            return CreatedAtAction(nameof(GetProduct), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(Guid id, [FromBody] ProductViewModel model)
        {
            if (id != model.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productServices.UpdateAsync(model);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            await _productServices.DeleteAsync(id);
            return NoContent();
        }
    }
}

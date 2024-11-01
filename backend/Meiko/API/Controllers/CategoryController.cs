using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryServices _categoryServices;
        public CategoryController(ICategoryServices categoryServices)
        {
            _categoryServices = categoryServices;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetAll()
        {
            var categories = await _categoryServices.GetAll();
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Categories>> GetBrand(Guid id)
        {
            var categorie = await _categoryServices.GetById(id);
            if (categorie == null) return NotFound();
            return Ok(categorie);
        }
        [HttpPost("add-category")]
        public async Task<ActionResult> Create([FromBody] CategoryViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _categoryServices.Create(model);
            return Ok(model);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] CategoryViewModel model)
        {
            if (id != model.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _categoryServices.Update(model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _categoryServices.Delete(id);
            return NoContent();
        }
    }
}

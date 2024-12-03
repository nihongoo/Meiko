using API.Extention;
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
        private readonly ToolDB<Categories> _tool;
        public CategoryController(ICategoryServices categoryServices, ToolDB<Categories> tool)
        {
            _categoryServices = categoryServices;
            _tool = tool;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetAll()
        {
            var categories = await _categoryServices.GetAll();
            return Ok(categories);
        }
        [HttpGet("Get/{id}")]
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
        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] CategoryViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _categoryServices.Update(id, model);
            return NoContent();
        }
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _categoryServices.Delete(id);
            return NoContent();
        }

		[HttpGet("Search")]
		public async Task<IActionResult> Search(string query)
		{
			var result = await _tool.Search(query, "Name");
			return Ok(result);
		}
	}
}

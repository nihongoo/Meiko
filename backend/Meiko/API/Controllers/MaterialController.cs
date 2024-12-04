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
    public class MaterialController : ControllerBase
    {
        private readonly IMaterialServices _materialServices;
        private readonly ToolDB<Materials> _tool;
        public MaterialController(IMaterialServices materialServices, ToolDB<Materials> tool)
        {
            _materialServices = materialServices;
            _tool = tool;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Materials>>> GetAll()
        {
            var materials = await _materialServices.GetAll();
            return Ok(materials);
        }
        [HttpGet("Get/{id}")]
        public async Task<ActionResult<Materials>> GetBrand(Guid id)
        {
            var material = await _materialServices.GetById(id);
            if (material == null) return NotFound();
            return Ok(material);
        }
        [HttpPost("add-material")]
        public async Task<ActionResult> Create([FromBody] MaterialViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _materialServices.Create(model);
            return Ok(model);
        }
        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] MaterialViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _materialServices.Update(id, model);
            return NoContent();
        }
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _materialServices.Delete(id);
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

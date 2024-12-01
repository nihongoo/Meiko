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
    public class BrandController : ControllerBase
    {
        private readonly IBrandServices _brandServices;
        private readonly ToolDB<Brands> _tool;
        public BrandController(IBrandServices brandServices, ToolDB<Brands> tool)
        {
            _brandServices = brandServices;
            _tool = tool;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Brands>>> GetAll()
        {
            var brands = await _brandServices.GetAll();
            return Ok(brands);
        }
        [HttpGet("Get/{id}")]
        public async Task<ActionResult<Brands>> GetBrand(Guid id)
        {
            var brand = await _brandServices.GetById(id);
            if (brand == null) return NotFound();
            return Ok(brand);
        }
        [HttpPost("add-brand")]
        public async Task<ActionResult> Create([FromBody] BrandViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _brandServices.Create(model);
            return Ok(model);
        }
        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] BrandViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _brandServices.Update(id, model);
            return NoContent();
        }
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _brandServices.Delete(id);
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

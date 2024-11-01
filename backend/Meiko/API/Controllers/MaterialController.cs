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
        public MaterialController(IMaterialServices materialServices)
        {
            _materialServices = materialServices;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Materials>>> GetAll()
        {
            var materials = await _materialServices.GetAll();
            return Ok(materials);
        }
        [HttpGet("{id}")]
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
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] MaterialViewModel model)
        {
            if (id != model.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _materialServices.Update(model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _materialServices.Delete(id);
            return NoContent();
        }
    }
}

using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController : ControllerBase
    {
        private readonly IColorServices _colorServices;
        public ColorController(IColorServices colorServices)
        {
            _colorServices = colorServices;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Colors>>> GetAll()
        {
            var colors = await _colorServices.GetAll();
            return Ok(colors);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Colors>> GetBrand(Guid id)
        {
            var color = await _colorServices.GetById(id);
            if (color == null) return NotFound();
            return Ok(color);
        }
        [HttpPost("add-color")]
        public async Task<ActionResult> Create([FromBody] ColorViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _colorServices.Create(model);
            return Ok(model);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] ColorViewModel model)
        {
            if (id != model.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _colorServices.Update(model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _colorServices.Delete(id);
            return NoContent();
        }
    }
}

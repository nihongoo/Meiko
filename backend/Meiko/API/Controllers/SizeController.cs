using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizeController : ControllerBase
    {
        private readonly ISizeServices _sizeServices;
        public SizeController(ISizeServices sizeServices)
        {
            _sizeServices = sizeServices;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Sizes>>> GetAll()
        {
            var sizes = await _sizeServices.GetAll();
            return Ok(sizes);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Sizes>> GetBrand(Guid id)
        {
            var size = await _sizeServices.GetById(id);
            if (size == null) return NotFound();
            return Ok(size);
        }
        [HttpPost("add-size")]
        public async Task<ActionResult> Create([FromBody] SizeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _sizeServices.Create(model);
            return Ok(model);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] SizeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _sizeServices.Update(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _sizeServices.Delete(id);
            return NoContent();
        }
    }
}

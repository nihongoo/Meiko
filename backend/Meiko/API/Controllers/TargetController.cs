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
    public class TargetController : ControllerBase
    {
        private readonly ITargetServices _targetServices;
        private readonly ToolDB<TargretCustomers> _tool;
        public TargetController(ITargetServices targetServices, ToolDB<TargretCustomers> tool)
        {
            _targetServices = targetServices;
            _tool = tool;
        }
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<TargretCustomers>>> GetAll()
        {
            var targretCustomers = await _targetServices.GetAll();
            return Ok(targretCustomers);
        }
        [HttpGet("Get/{id}")]
        public async Task<ActionResult<TargretCustomers>> GetBrand(Guid id)
        {
            var targret = await _targetServices.GetById(id);
            if (targret == null) return NotFound();
            return Ok(targret);
        }
        [HttpPost("add-target")]
        public async Task<ActionResult> Create([FromBody] TargretCustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _targetServices.Create(model);
            return Ok(model);
        }
        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateBrand(Guid id, [FromBody] TargretCustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _targetServices.Update(id, model);
            return NoContent();
        }
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBrand(Guid id)
        {
            await _targetServices.Delete(id);
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

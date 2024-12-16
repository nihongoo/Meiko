using API.IServices;
using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DataAnalysisController : ControllerBase
	{
		private readonly IDataAnalysis _service;

        public DataAnalysisController(IDataAnalysis service)
        {
			_service = service;
        }

		[HttpGet("General")]
		public async Task<IActionResult> General()
		{
			return Ok(await _service.General());
		}

		[HttpGet("Top-Customer")]
		public async Task<IActionResult> TopCustomer()
		{
			return Ok(await _service.TopCustomer());
		}

		[HttpGet("top-products")]
		public async Task<IActionResult> TopProduct([FromQuery] DateTime? date)
		{
			var result = await _service.TopProduct(date);
			return Ok(result);
		}

	}
}

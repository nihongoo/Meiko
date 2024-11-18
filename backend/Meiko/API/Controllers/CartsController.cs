using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CartsController : ControllerBase
	{
		private readonly ICartServices _cartServices;
        public CartsController(ICartServices cartServices)
        {
            _cartServices = cartServices;
        }
        // Debug Only
        [HttpGet]
		public async Task<ActionResult<IEnumerable<Carts>>> Get()
		{
			return Ok(_cartServices.GetAllCartAsync().Result);
		}

		// GET api/<CartsController>/5
		[HttpGet("{customerid}", Name = "GetCartByCustomerId")]
		public async Task<ActionResult<Carts>> GetCartByCustomerId(Guid customerid)
		{
			var cart = await _cartServices.GetCartByCustomerIdAsync(customerid);
			if (cart == null)
			{
				return NotFound();
			}
			return Ok(cart);

		}

		// POST api/<CartsController>
		[HttpPost]
		public async Task<IActionResult> Post(Guid customerid)
		{
			var result = await _cartServices.CreateCartAsync(customerid);

			if (!result) BadRequest("Không thể tạo giỏ hàng!");
			return Ok(result);
		}

		// PUT api/<CartsController>/5
		[HttpPut("{cartid}")]
		public async Task<IActionResult> Put(Guid cartid, int Status)
		{
			var result = await _cartServices.UpdateCartAsync(cartid, Status);

			if (!result) return BadRequest("Cập nhật giỏ hàng thất bại!");
			return Ok(result);
		}

		// When Account is deleted
		[HttpDelete("{customerid}")]
		public async Task<IActionResult> Delete(Guid customerid)
		{
			var result = await _cartServices.DeleteCartAsync(customerid);

			if (!result) return BadRequest("Không thể xoá giỏ hàng!");
			return Ok();
		}
	}
}

using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CartDetailsController : ControllerBase
	{
		private readonly ICartDetailServices _cartDetailServices;
		private readonly ICartServices _cartServices;
        public CartDetailsController(ICartDetailServices cartDetailServices, ICartServices cartServices)
        {
            _cartDetailServices = cartDetailServices;
			_cartServices = cartServices;
        }
        // GET: api/<CartDetailsController>
        [HttpGet]
		public async Task<IEnumerable<CartDetails>> Get()
		{
			return await _cartDetailServices.GetCartDetailsAsync();
		}

		// GET api/<CartDetailsController>/5
		[HttpGet("get-all-cartdetail-by/{cartid}")]
		public async Task<IEnumerable<CartDetails>> Get(Guid cartid)
		{
			return await _cartDetailServices.GetCDsByCartId(cartid);
		}

		// POST api/<CartDetailsController>
		[HttpPost("add-to-cart")]
		public async Task<string> AddToCart(Guid CartId, Guid ProductDetailId, int Quantity)
		{
			var response = await _cartDetailServices.AddToCart(CartId, ProductDetailId, Quantity);

			await _cartServices.UpdateCartAsync(CartId, null);
			return response;
		}

		// PUT api/<CartDetailsController>/5
		[HttpPut("change-stock-only/{cartdetailid}")]
		public async Task<string> ChangeStockOnly(Guid cartdetailid, Guid ProductDetailId, int Quantity)
		{
			var response = await _cartDetailServices.ChangeStockOnly(cartdetailid, ProductDetailId, Quantity);

			await _cartServices.UpdateCartAsync(await _cartDetailServices.GetCartIdByCDId(cartdetailid), null);
			return response;
		}

		// DELETE api/<CartDetailsController>/5
		[HttpDelete("remove-from-cart/{cartdetailid}")]
		public async Task<IActionResult> RemoveFromCart(Guid cartdetailid)
		{
			var cartId = await _cartDetailServices.GetCartIdByCDId(cartdetailid);

			var response = await _cartDetailServices.RemoveFromCart(cartdetailid);

			if (!response) return BadRequest("Không thể xoá sản phẩm này!");
			
			await _cartServices.UpdateCartAsync(cartId, null);
			return Ok();
		}

		[HttpDelete("clear-cart/{cartid}")]
		public async Task<IActionResult> ClearCart(Guid cartid)
		{
			var response = await _cartDetailServices.ClearCart(cartid);

			if (!response) return BadRequest("Đã có lỗi xảy ra khi xoá sản phẩm trong giỏ hàng!");

			await _cartServices.UpdateCartAsync(cartid, null);
			return Ok();
		}
	}
}

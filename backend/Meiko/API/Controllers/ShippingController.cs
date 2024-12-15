using API.IServices;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ShippingController : Controller
	{
		private readonly IGHNService _shippingService;
		public ShippingController(IGHNService iGHNService)
		{
			_shippingService = iGHNService;
		}

		[HttpPost("calculate-shipping-fee")]
		public async Task<IActionResult> CalculateShippingFeeAsync([FromBody] ShippingRequest shippingRequest)
		{
			try
			{
				// Tính phí giao hàng thông qua Service
				decimal fee = await _shippingService.CalculateShippingFeeAsync(
					shippingRequest.FromCityName,
					shippingRequest.FromDistrictName,
					shippingRequest.ToCityName,
					shippingRequest.ToDistrictName,
					shippingRequest.ToWardName
				);

				return Ok(new { Fee = fee });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		// API để lấy danh sách tỉnh/thành phố
		[HttpGet("provinces")]
		public async Task<IActionResult> GetProvincesAsync()
		{
			try
			{
				var provinces = await _shippingService.GetProvinceListAsync();
				return Ok(provinces);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		// API để lấy danh sách quận/huyện theo tỉnh
		[HttpGet("districts")]
		public async Task<IActionResult> GetDistrictsAsync(int provinceId)
		{
			try
			{
				var districts = await _shippingService.GetDistrictListAsync(provinceId);
				return Ok(districts);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		// API để lấy danh sách xã/phường theo quận
		[HttpGet("wards")]
		public async Task<IActionResult> GetWardsAsync(int districtId)
		{
			try
			{
				var wards = await _shippingService.GetWardListAsync(districtId);
				return Ok(wards);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}
	}
	
}
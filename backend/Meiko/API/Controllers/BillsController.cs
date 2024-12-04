using API.DTO;
using API.IServices;
using API.Models;
using DataProcessing.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;
using System.Collections.ObjectModel;
using System.Security.Cryptography;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BillsController : ControllerBase
	{
		private readonly IBillServices _IBillServices;
		private readonly string _apiKey;
		private readonly string _checkSum;
		private readonly string _clientId;
		public BillsController(IBillServices billServices, IConfiguration configuration)
        {
            _IBillServices = billServices;
			_apiKey = configuration["PayOS:ApiKey"];
			_checkSum = configuration["PayOS:CheckSumKey"];
			_clientId = configuration["PayOS:ClientId"];
		}

		// Cung cấp dữ liệu
		[HttpGet("get-bills")]
		public async Task<List<BillDto>> GetBills()
		{
			return await _IBillServices.GetBills();
		}

		[HttpGet("get-bills-by-customer-id/{id}")]
		public async Task<List<BillDto>> GetBillsByCuustomerId(Guid id)
		{
			return await _IBillServices.GetBillsByCustomerId(id);
		}

		[HttpGet("get-bill-by-id/{id}")]
		public async Task<BillDto> GetBillById(Guid id)
		{
			return await _IBillServices.GetBillById(id);
		}

		[HttpGet("get-billDetails")]
		public async Task<List<BillDetailDto>> GetBillDetails()
		{
			return await _IBillServices.GetBillDetails();
		}

		[HttpGet("get-billDetails-by-billId/{id}")]
		public async Task<List<BillDetailDto>> GetBillDetailsByBillId(Guid id)
		{
			return await _IBillServices.GetBillDetailsByBillId(id);
		}

		[HttpGet("get-billDetail-by-id/{id}")]
		public async Task<BillDetailDto> GetBillDetailById(Guid id)
		{
			return await _IBillServices.GetBillDetailById(id);
		}

		[HttpGet("get-shippingAddresses")]
		public async Task<List<ShippingAddressDto>> GetShippingAddress()
		{
			return await _IBillServices.GetShippingAddresses();
		}

		[HttpGet("get-shippingAddresses-by-billId/{id}")]
		public async Task<List<ShippingAddressDto>> GetShippingAddressByBillId(Guid id)
		{
			return await _IBillServices.GetShippingAddressesByBillId(id);
		}

		[HttpGet("get-shippingAddress-by-id/{id}")]
		public async Task<ShippingAddressDto> GetShippingAddressById(Guid id)
		{
			return await _IBillServices.GetShippingAddressById(id);
		}

		[HttpGet("get-statusHistories")]
		public async Task<List<StatusHistoryDto>> GetStatusHistories()
		{
			return await _IBillServices.GetStatusHistories();
		}

		[HttpGet("get-statusHistories-by-billId/{id}")]
		public async Task<List<StatusHistoryDto>> GetStatusHistoriesByBillId(Guid id)
		{
			return await _IBillServices.GetStatusHistoriesByBillId(id);
		}

		[HttpGet("get-statusHistory-by-id/{id}")]
		public async Task<StatusHistoryDto> GetStatusHistoriesById(Guid id)
		{
			return await _IBillServices.GetStatusHistoryById(id);
		}

		[HttpGet("get-paymentHistories")]
		public async Task<List<PaymentHistoryDto>> GetPaymentHistories()
		{
			return await _IBillServices.GetPaymentHistories();
		}

		[HttpGet("get-paymentHistories-by-billId/{id}")]
		public async Task<List<PaymentHistoryDto>> GetPaymentHistoriesByBillId(Guid id)
		{
			return await _IBillServices.GetPaymentHistoriesByBillId(id);
		}

		[HttpGet("get-paymentHistory-by-id/{id}")]
		public async Task<PaymentHistoryDto> GetPaymentHistoriesById(Guid id)
		{
			return await _IBillServices.GetPaymentHistoryById(id);
		}

		// Xử lý

		//Bill
		[HttpPost("create-bill")]
		public async Task<IActionResult> CreateBill(BillInfoModel model)
		{
			return Ok(await _IBillServices.Create(DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(), model.IsShipping, model.ShippingFee, model.StaffId, model.CustomerId, model.CartId, model.VoucherId));
		}

		[HttpDelete("delete-bill/{id}")]
		public async Task<IActionResult> DeleteBill(Guid id)
		{
			return Ok(await _IBillServices.Delete(id));
		}

		[HttpPost("change-status-from-bill/{id}")]
		public async Task<IActionResult> ChangeStatus(Guid id, StatusInfo model)
		{
			return Ok(await _IBillServices.ChangeStatusTo(id, model.StatusType, model.Note, model.StaffWhoCreatedThis));
		}

		[HttpPost("pay-for-bill/{id}")]
		public async Task<IActionResult> PayForBill(Guid id, decimal paymentAmount)
		{
			return Ok(await _IBillServices.Pay(paymentAmount, 0, 0, id));
		}

		//Shipping Address
		[HttpPost("add-address-to-bill")]
		public async Task<IActionResult> AddAddressToBill(ShippingAddressInfoModel model)
		{
			return Ok(await _IBillServices.AddAddressToBill(model));
		}

		[HttpPut("edit-address-from-id/{id}")]
		public async Task<IActionResult> EditAddress(Guid id, ShippingAddressInfoModel model)
		{
			return Ok(await _IBillServices.EditAddress(id, model));
		}

		//Bill Detail
		[HttpPost("add-to-bill")]
		public async Task<IActionResult> AddToBill(BillDetailInfoModel model)
		{
			return Ok(await _IBillServices.AddToBill(model));
		}

		[HttpPut("add-quantity-to/{id}")]
		public async Task<IActionResult> AddQuantity(Guid id, int Quantity)
		{
			return Ok(await _IBillServices.AddQuantity(id, Quantity));
		}

		[HttpPut("change-quantity-for/{id}")]
		public async Task<IActionResult> ChangeQuantity(Guid id, int Quantity)
		{
			return Ok(await _IBillServices.ChangeQuantityFor(id, Quantity));
		}

		//Momo API
		[HttpPost("CreatePaymentWithMomo")]
		public async Task<IActionResult> Post(OrderInfoModel model)
		{
			var response = await _IBillServices.CreatePaymentAsync(model);
			return Ok(response);
		}

		[HttpGet("Momo/Callback")]
		public async Task<IActionResult> GetCallBack([FromQuery]MomoExecuteResponseModel collection)
		{
			await _IBillServices.Pay(collection.Amount, 1, 0, Guid.Parse(collection.OrderId));
			return Ok(collection);
		}

		//PayOS API
		[HttpPost("CreatePaymentWithPayOS")]
		public async Task<IActionResult> CreatePayOS(OrderInfoModel model)
		{
			return Ok(await _IBillServices.CreatePayOSRequestAsync(model));
		}

		[HttpGet("PayOS/ReturnPayOS/{billId}")]
		public async Task<IActionResult> ReturnData(Guid billId, [FromQuery] int code, [FromQuery] string id, [FromQuery] bool cancel, [FromQuery] string status, [FromQuery] int orderCode)
		{
			try
			{
				PayOS payOS = new PayOS(_clientId, _apiKey, _checkSum);
				PaymentLinkInformation paymentLinkInfo = await payOS.getPaymentLinkInformation(orderCode);

				if (status == "PAID")
				{
					// Cập nhật trạng thái đơn hàng trong hệ thống
					await _IBillServices.Pay(paymentLinkInfo.amountPaid, 0, 0, billId);

				}
				else
				{
					// Xử lý các trạng thái khác (PENDING, CANCELLED...)
					return BadRequest(paymentLinkInfo);
				}

				// 3. Trả về trạng thái thành công
				return Ok(paymentLinkInfo);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new ReturnMessage()
				{
					status = 2,
					message = $"Đã xảy ra lỗi khi giao dịch : {ex.InnerException}",
				});
			}
		}

		[HttpGet("PayOS/CancelPayOS/{id}")]
		public async Task<IActionResult> CancelData(Guid id, [FromQuery] string orderId, [FromQuery] string status, [FromQuery] decimal? amount)
		{
			try
			{
				// Kiểm tra trạng thái và xử lý hủy đơn hàng
				if (status == "CANCELLED")
				{
					

					// Thực hiện các hành động khác nếu cần, như ghi log hoặc thông báo người dùng.
					return Ok(await _IBillServices.CancelPaymentById(id));
				}

				// Xử lý trạng thái khác (nếu có)
				return BadRequest(new ReturnMessage { status = 1, message = "Invalid status received." });
			}
			catch (Exception ex)
			{
				// Trả về lỗi nếu xảy ra vấn đề
				return StatusCode(500, new ReturnMessage { status = 2, message = $"Đã xảy ra lỗi :  {ex.Message}" });
			}
		}

		//private string GenerateSignature(string data, string checksumKey)
		//{
		//	var keyBytes = Encoding.UTF8.GetBytes(checksumKey);
		//	using (var hmac = new HMACSHA256(keyBytes))
		//	{
		//		var dataBytes = Encoding.UTF8.GetBytes(data);
		//		var hashBytes = hmac.ComputeHash(dataBytes);
		//		return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
		//	}
		//}
	}
}

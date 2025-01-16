using API.DTO;
using API.Extention;
using API.IServices;
using API.Models;
using API.Services;
using API.ViewModel;
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
		private readonly ToolDB<Bills> _tool;

		public BillsController(IBillServices billServices, IConfiguration configuration, ToolDB<Bills> tool)
		{
			_IBillServices = billServices;
			_apiKey = configuration["PayOS:ApiKey"];
			_checkSum = configuration["PayOS:CheckSumKey"];
			_clientId = configuration["PayOS:ClientId"];
			_tool = tool;
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
		[HttpGet("get-bill-by-status/{status}")]
		public async Task<BillDto> GetBillById(int status)
		{
			return await _IBillServices.GetBillByStatus(status);
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
		public async Task<ActionResult<object>> CreateBill(BillInfoModel model)
		{

			var result = await _IBillServices.Create(model.IsShipping, model.ShippingFee, model.StaffId, model.CustomerId, model.CartId, model.VoucherId, model.BillCode, model.BillType);

			if (result.k)
			{
				return Ok(new { success = result.k, id = result.id });
			}
			else
			{
				return BadRequest(new { success = result.k, message = "Failed to create bill." });
			}
		}

		[HttpPut("update-shipping-fee/{billId}")]
		public async Task<IActionResult> UpdateShippingFee(Guid billId, [FromBody] UpdateShippingFeeViewModel request)
		{
			if (billId == Guid.Empty || request == null || request.NewShippingFee < 0)
			{
				return BadRequest("Thông tin không hợp lệ.");
			}

			try
			{
				// Gọi service để cập nhật hóa đơn
				var (success, updatedBillId) = await _IBillServices.UpdateBill(billId, request.NewShippingFee);

				if (success)
				{
					return Ok(new { Status = 0 });
				}
				else
				{
					return NotFound("Hóa đơn không tồn tại hoặc không thể cập nhật.");
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Lỗi máy chủ: {ex.Message}");
			}
		}


		[HttpDelete("delete-bill/{id}")]
		public async Task<IActionResult> DeleteBill(Guid id, [FromQuery] string? note, [FromQuery] Guid StaffWhoDothis)
		{
			var result = _IBillServices.Delete(id).Result;
			if (result.status == 0)
			{
				await _IBillServices.ChangeStatusTo(id, 10, note, StaffWhoDothis);
				return Ok(result);
			}
			else
				return Ok(result);
		}

		[HttpPost("refund/{id}")]
		public async Task<IActionResult> Refund(Guid id, [FromQuery] string? note, [FromQuery] Guid CustomerWhoDothis)
		{
			var result = _IBillServices.Refund(id, CustomerWhoDothis, note).Result;
			if (result.status == 0)
				return Ok(result);
			else
				return BadRequest(result);
		}

		[HttpPost("change-status-from-bill/{id}")]
		public async Task<IActionResult> ChangeStatus(Guid id, StatusInfo model)
		{
			return Ok(await _IBillServices.ChangeStatusTo(id, model.StatusType, model.Note, model.StaffWhoCreatedThis));
		}

		[HttpPost("prev-status-from-bill/{id}")]
		public async Task<IActionResult> PrevStatus(Guid id, StatusInfo model)
		{
			return Ok(await _IBillServices.PrevStatus(id, model.StatusType, model.Note, model.StaffWhoCreatedThis));
		}


		[HttpPost("pay-for-bill/{id}")]
		public async Task<IActionResult> PayForBill(Guid id, [FromQuery] decimal paymentAmount, [FromQuery] Guid staffWhoDoThis)
		{
			var result = await _IBillServices.Pay(paymentAmount, 0, 0, id);
			if (result.status == 0)
			{
				await _IBillServices.ChangeStatusTo(id, 11, null, staffWhoDoThis);

				return Ok(result);
			}
			return Ok(result);
		}

        [HttpPost("pay-for-customer/{id}")]
        public async Task<IActionResult> PayForCustomer(Guid id, [FromQuery] decimal paymentAmount, [FromQuery] Guid staffWhoDoThis)
        {
            var result = await _IBillServices.PayForCustomer(paymentAmount, 0, 0, id);
            if (result.status == 0)
            {
                await _IBillServices.ChangeStatusTo(id, 11, null, staffWhoDoThis);

                return Ok(result);
            }
            return Ok(result);
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
		[HttpPost("CreatePaymentWithMomo/{id}")]
		public async Task<IActionResult> Post(Guid id, string description)
		{
			var response = await _IBillServices.CreatePaymentAsync(id, description);
			return Ok(response);
		}

		[HttpPost("Momo/Notify")]
		public async Task<IActionResult> GetCallBack([FromBody] MomoExecuteResponseModel collection)
		{
			if (collection.ResultCode == 0)
			{
				await _IBillServices.Pay(collection.Amount, 0, 1, Guid.Parse(collection.OrderId));
			}

			return Ok(collection);
		}

		//PayOS API
		[HttpPost("CreatePaymentWithPayOS/{id}")]
		public async Task<IActionResult> CreatePayOS(Guid id, [FromQuery] string descrtiption)
		{
			return Ok(await _IBillServices.CreatePayOSRequestAsync(id, descrtiption));
		}

		[HttpGet("PayOS/ReturnPayOS/{billId}/{whodothis}")]
		public async Task<IActionResult> ReturnData(Guid billId, [FromRoute] Guid whodothis, [FromQuery] int code, [FromQuery] string id, [FromQuery] bool cancel, [FromQuery] string status, [FromQuery] long orderCode)
		{
			try
			{
				PayOS payOS = new PayOS(_clientId, _apiKey, _checkSum);
				PaymentLinkInformation paymentLinkInfo = await payOS.getPaymentLinkInformation(orderCode);

				if (status == "PAID")
				{
					// Cập nhật trạng thái đơn hàng trong hệ thống
					await _IBillServices.PayForCustomer(paymentLinkInfo.amountPaid, 1, 0, billId);
					await _IBillServices.ChangeStatusTo(billId, 10, null, whodothis);
					await _IBillServices.ChangeStatusTo(billId, 2, "Khách hàng đặt hàng", whodothis);
				}
				else
				{
					// Xử lý các trạng thái khác (PENDING, CANCELLED...)
					return BadRequest(paymentLinkInfo);
				}

				// 3. Trả về trạng thái thành công
				return Redirect("http://localhost:3000/order-success");
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
		[HttpGet("PayOS/ReturnPayOSOffline/{billId}/{whodothis}")]
		public async Task<IActionResult> ReturnDataOffline(Guid billId, [FromRoute] Guid whodothis, [FromQuery] long orderCode)
		{
			try
			{
				PayOS payOS = new PayOS(_clientId, _apiKey, _checkSum);
				PaymentLinkInformation paymentLinkInfo = await payOS.getPaymentLinkInformation(orderCode);
                await _IBillServices.Pay(paymentLinkInfo.amountPaid, 1, 0, billId);
                await _IBillServices.ChangeStatusTo(billId, 10, null, whodothis);
                await _IBillServices.ChangeStatusTo(billId, 6, null, whodothis);
				return Redirect("http://localhost:3000/soldoffline");
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

		[HttpGet("PayOS/CancelPayOS/{billId}")]
		public async Task<IActionResult> CancelData(Guid billId, [FromQuery] int code, [FromQuery] string id, [FromQuery] bool cancel, [FromQuery] string status, [FromQuery] long orderCode)
		{
			try
			{
				// Kiểm tra trạng thái và xử lý hủy đơn hàng
				if (status == "CANCELLED")
				{
					// Thực hiện các hành động khác nếu cần, như ghi log hoặc thông báo người dùng.
					await _IBillServices.CancelPaymentById(billId, orderCode);
					return Redirect("http://localhost:3000/soldoffline");
				}

				// Xử lý trạng thái khác (nếu có)
				return BadRequest(new ReturnMessage { status = 1, message = "Trạng thái nhận được không chính xác" });
			}
			catch (Exception ex)
			{
				// Trả về lỗi nếu xảy ra vấn đề
				return StatusCode(500, new ReturnMessage { status = 2, message = $"Đã xảy ra lỗi :  {ex.Message}" });
			}
		}

		[HttpGet("Search")]
		public async Task<IActionResult> Search(string query)
		{
			var result = await _tool.Search(query, "BillCode");
			return Ok(result);
		}

		[HttpGet("List-Bill-Detail")]
		public async Task<IActionResult> ListBillDetail(Guid id)
		{
			var result = await _IBillServices.listBillDetails(id);
			return Ok(result);
		}

		[HttpDelete("Delete-Bill-Detail")]
		public async Task<IActionResult> Delete(Guid id)
		{
			var result = await _IBillServices.DeleteBillDetail(id);
			if (result.k)
			{
				return Ok(new { success = result.k, msg = result.msg });
			}
			else
			{
				return BadRequest(new { success = result.k, msg = result.msg });
			}
		}
		[HttpGet("Filter")]
		public async Task<IActionResult> Filter(DateTime startDate, DateTime endDate)
		{
			var result = await _IBillServices.Filter(startDate, endDate);
			return Ok(result);
		}

		[HttpPost("return")]
		public async Task<IActionResult> ReturnProduct([FromBody] RequestRefund request)
		{
			var (success, message) = await _IBillServices.ReturnProduct(request);
			if (success)
			{
				return Ok(message); // Trả về 200 OK với thông điệp thành công
			}

			return BadRequest(message); // Trả về 400 Bad Request với thông điệp lỗi
		}

		[HttpPost("{requestId}/accept")]
		public async Task<IActionResult> AcceptRefundRequest(Guid requestId, Guid staff)
		{
			try
			{
				var success = await _IBillServices.AcceptRefundRequest(requestId, staff);
				if (success)
				{
					return Ok("Refund request accepted and products returned to stock.");
				}

				return BadRequest("Failed to accept the refund request.");
			}
			catch (ArgumentException ex)
			{
				return NotFound(ex.Message); // Trả về 404 Not Found nếu không tìm thấy yêu cầu
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPost("{requestId}/reject")]
		public async Task<IActionResult> RejectRefundRequest(Guid requestId, Guid staff)
		{
			try
			{
				var success = await _IBillServices.RejectRefundRequest(requestId, staff);
				if (success)
				{
					return Ok("Refund request rejected and bill status updated to completed.");
				}

				return BadRequest("Failed to reject the refund request.");
			}
			catch (ArgumentException ex)
			{
				return NotFound(ex.Message); // Trả về 404 Not Found nếu không tìm thấy yêu cầu
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpGet("List-Request")]
		public async Task<IActionResult> ListRequest(Guid id)
		{
			return Ok(await _IBillServices.ListRequest(id));
		}
	}
}

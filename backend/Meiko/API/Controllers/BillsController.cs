using API.DTO;
using API.Extention;
using API.IServices;
using API.Models;
using DataProcessing.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BillsController : ControllerBase
	{
		private readonly IBillServices _IBillServices;
		private readonly ToolDB<Bills> _tool;
		public BillsController(IBillServices billServices, ToolDB<Bills> tool)
		{
			_IBillServices = billServices;
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
			var result = await _IBillServices.Create(model.BillCode, model.IsShipping, model.ShippingFee, model.StaffId, model.CustomerId, model.CartId, model.VoucherId);
			if (result.k)
			{
				return Ok(new { success = result.k, id = result.id });
			}
			else
			{
				return BadRequest(new { success = result.k, message = "Failed to create bill." });
			}
		}


		[HttpDelete("delete-bill/{id}")]
		public async Task<bool> DeleteBill(Guid id)
		{
			return await _IBillServices.Delete(id);
		}

		[HttpPost("change-status-from-bill/{id}")]
		public async Task<bool> ChangeStatus(Guid id, StatusInfo model)
		{
			return await _IBillServices.ChangeStatusTo(id, model.StatusType, model.Note, model.StaffWhoCreatedThis);
		}

		//Shipping Address
		[HttpPost("add-address-to-bill")]
		public async Task<bool> AddAddressToBill(ShippingAddressInfoModel model)
		{
			return await _IBillServices.AddAddressToBill(model);
		}

		[HttpPut("edit-address-from-id/{id}")]
		public async Task<IActionResult> EditAddress(Guid id, ShippingAddressInfoModel model)
		{
			await _IBillServices.EditAddress(id, model);
			return CreatedAtAction(nameof(GetShippingAddressById), new { id }, model);
		}

		//Bill Detail
		[HttpPost("add-to-bill")]
		public async Task<bool> AddToBill(BillDetailInfoModel model)
		{
			return await _IBillServices.AddToBill(model);
		}

		[HttpPut("add-quantity-to/{id}")]
		public async Task<bool> AddQuantity(Guid id, int Quantity)
		{
			return await _IBillServices.AddQuantity(id, Quantity);
		}

		[HttpPut("change-quantity-for/{id}")]
		public async Task<bool> ChangeQuantity(Guid id, int Quantity)
		{
			return await _IBillServices.ChangeQuantityFor(id, Quantity);
		}

		//Momo API
		[HttpPost("CreatePaymentWithMomo")]
		public async Task<IActionResult> Post(OrderInfoModel model)
		{
			var response = await _IBillServices.CreatePaymentAsync(model);
			return Ok(response);
		}

		[HttpPost("Momo/Notify")]
		public async Task<IActionResult> GetCallBack([FromBody] MomoExecuteResponseModel collection)
		{
			if (collection.ErrorCode == 0)
			{
				await _IBillServices.Pay(decimal.Parse(collection.Amount), 0, 1, Guid.Parse(collection.OrderId));
			}

			return Ok(collection);

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
	}
}

using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : Controller
    {
        private readonly IVoucherServices _voucherServices;
        public VoucherController(IVoucherServices voucherServices)
        {
            _voucherServices = voucherServices;
        }
        [HttpPost("Create")]
        public async Task<IActionResult> CreateVoucher([FromBody] VoucherViewModel vouchers)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createVoucher = await _voucherServices.CreateVoucherAsync(vouchers);
            return Ok(createVoucher);
        }
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetVoucherById(Guid id)
        {
            var voucher = await _voucherServices.GetVoucherByIdAsync(id);
            if(voucher == null)
            {
                return NotFound();
            }
            return Ok(voucher);
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllVoucher()
        {
            var vouchers = await _voucherServices.GetAllVouchersAsync();
            return Ok(vouchers);
        }
        [HttpPost("Use")]
        public async Task<IActionResult> UseVoucher([FromQuery] Guid voucherId, [FromQuery] Guid customerId, [FromQuery] double billAmount)
        {
            var success = await _voucherServices.UseVoucherAsync(voucherId, customerId, billAmount);
            if (!success)
            {
                return BadRequest("Không thể sử dụng voucher: không đáp ứng yêu cầu.");
            }
            return Ok(success);
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteVoucher(Guid id)
        {
            await _voucherServices.DeleteVoucherAsync(id);
            return NoContent();
        }
        [HttpGet("Filter")]
        public async Task<IActionResult> Filter (DateTime startDate, DateTime endDate)
        {
            var result = await _voucherServices.Filter(startDate, endDate);
            return Ok(result);
        }
    }

}

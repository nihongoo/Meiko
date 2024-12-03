using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : Controller
    {
        private readonly IAddressServices _addressServices;
        public AddressController(IAddressServices addressServices)
        {
            _addressServices = addressServices;
        }
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetAddresses(Guid customerId)
        {
            var addresses = await _addressServices.GetAddressesByCustomerIdAsync(customerId);
            return Ok(addresses);
        }
        [HttpGet("address/{addressId}")]
        public async Task<IActionResult> GetAddress(Guid addressId)
        {
            var address = await _addressServices.GetAddressByIdAsync(addressId);
            if (address == null)
                return NotFound();

            return Ok(address);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateAddress(Guid customerId, [FromBody] AddressViewModel addressViewModel)
        {
            try
            {
                if (addressViewModel == null)
                {
                    return BadRequest("Địa chỉ không được để trống.");
                }

                var result = await _addressServices.CreateAddressAsync(customerId, addressViewModel);

                if (!result)
                    return BadRequest("Không thể tạo địa chỉ.");

                var createdAddress = await _addressServices.GetAddressesByCustomerIdAsync(customerId);

                return Ok(createdAddress);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message, errors = ex.ValidationResult });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi: " + ex.Message);
            }
        }

        [HttpPut("update/{addressId}")]
        public async Task<IActionResult> UpdateAddress(Guid addressId, [FromBody] AddressViewModel addressViewModel)
        {
            try
            {
                var result = await _addressServices.UpdateAddressAsync(addressId, addressViewModel);
                if (!result)
                    return BadRequest("Không thể cập nhật địa chỉ.");

                return NoContent();
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message, errors = ex.ValidationResult });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi: " + ex.Message);
            }
        }
        [HttpDelete("{addressId}")]
        public async Task<IActionResult> DeleteAddress(Guid addressId)
        {
            var result = await _addressServices.DeleteAddressAsync(addressId);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}

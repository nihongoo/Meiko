using API.DTO;
using API.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountServices _accountService;

        public AccountController(IAccountServices accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register-customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerDto registerDto)
        {
            var result = await _accountService.RegisterCustomerAsync(registerDto);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return Ok("Đăng ký khách hàng thành công.");
        }

        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffDto registerDto)
        {
            var result = await _accountService.RegisterStaffAsync(registerDto);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return Ok("Đăng ký nhân viên thành công.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var tokenDto = await _accountService.LoginAsync(loginDto);
                return Ok(tokenDto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnly()
        {
            return Ok("Chỉ admin có thể truy cập!");
        }

        [Authorize(Roles = "Staff")]
        [HttpGet("staff-only")]
        public IActionResult StaffOnly()
        {
            return Ok("Chỉ nhân viên có thể truy cập!");
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("customer-only")]
        public IActionResult CustomerOnly()
        {
            return Ok("Chỉ khách hàng có thể truy cập!");
        }
    }
}

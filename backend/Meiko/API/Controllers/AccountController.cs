using API.DTO;
using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountServices _accountService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOtpService _tpService;
        private readonly AppDbContext _appDbContext;
        public AccountController(IAccountServices accountService, IEmailService emailService, UserManager<ApplicationUser> userManager, IOtpService tpService, AppDbContext appDbContext)
        {
            _accountService = accountService;
            _emailService = emailService;
            _userManager = userManager;
            _tpService = tpService;
            _appDbContext = appDbContext;
        }

        [HttpPost("register-customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _accountService.RegisterCustomerAsync(registerDto);
            if (result.Succeeded)
            {
                return Ok("Đăng ký thành công!");
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _accountService.RegisterStaffAsync(registerDto);
            if (result.Succeeded)
            {
                return Ok("Đăng ký nhân viên thành công!");
            }

            return BadRequest(result.Errors);
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
            {
                return NotFound("Email không tồn tại trong hệ thống.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var otpCode = await _tpService.GenerateAndStoreOtpAsync(model.Email);

            await _emailService.SendOtpEmailAsync(model.Email, model.OtpCode);

            return Ok("Mã OTP đã được gửi đến email của bạn.");
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtpAndResetPassword([FromBody] VerifyOtpDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Không tìm thấy tài khoản với email này.");
            }


            var isValid = await _tpService.VerifyOtpAsync(model.Email, model.Otp);
            if (!isValid)
            {
                return BadRequest("Mã xác nhận không hợp lệ.");
            }

            var resetResult = await _userManager.RemovePasswordAsync(user);
            if (!resetResult.Succeeded)
            {
                return BadRequest("Không thể xóa mật khẩu cũ.");
            }
            var addPasswordResult = await _userManager.AddPasswordAsync(user, model.NewPassword);
            if (!addPasswordResult.Succeeded)
            {
                return BadRequest("Không thể đặt lại mật khẩu mới.");
            }

            return Ok("Mật khẩu của bạn đã được cập nhật thành công.");
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

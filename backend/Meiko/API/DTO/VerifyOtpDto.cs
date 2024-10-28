using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class VerifyOtpDto
    {
        [Required(ErrorMessage = "Mã xác nhận là bắt buộc.")]
        public string Otp { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        public string NewPassword { get; set; }
    }
}

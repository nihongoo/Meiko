using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class VoucherViewModel
    {
        [Required(ErrorMessage = "Mã voucher không được để trống.")]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Mã voucher phải từ 5 đến 50 ký tự.")]
        public string VoucherCode { get; set; }

        [Required(ErrorMessage = "Giá trị không được để trống.")]
        [Range(0, 100, ErrorMessage = "Giá trị phải nằm trong khoảng từ 0 đến 100%.")]
        public double Value { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền đặt hàng tối thiểu phải ít nhất là 0")]
        public double MinimumOrderAmount { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 1.")]
        public int Quantity { get; set; } = 11;

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống.")]
        public DateTime StartDay { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống.")]
        public DateTime EndDay { get; set; }

        [Required(ErrorMessage = "Vui lòng xác định loại voucher.")]
        public bool IsPublic { get; set; } //True là công khai, false là riêng tư

        public List<Guid>? CustomerIds { get; set; }
    }
}

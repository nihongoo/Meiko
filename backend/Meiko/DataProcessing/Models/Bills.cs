using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Bills
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã hóa đơn không được để trống.")]
        [StringLength(50, ErrorMessage = "Mã hóa đơn không được vượt quá 50 ký tự.")]
        public string? BillCode { get; set; }

        [Required(ErrorMessage = "Tổng tiền không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0.")]
        public double Total { get; set; }

        [Required(ErrorMessage = "Ngày tạo không được để trống.")]
        public DateTime CreateDate { get; set; }

        [Required(ErrorMessage = "Ngày giao hàng không được để trống.")]
        public DateTime NgayGiaoHang { get; set; }

        [Required(ErrorMessage = "Ngày nhận hàng không được để trống.")]
        public DateTime NgayNhanHang { get; set; }

        [Required(ErrorMessage = "Ngày thanh toán không được để trống.")]
        public DateTime NgayThanhToan { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [StringLength(100, ErrorMessage = "Tên người nhận không được vượt quá 100 ký tự.")]
        public string? TenNguoiNhan { get; set; }

        [EmailAddress(ErrorMessage = "Email người nhận không hợp lệ.")]
        public string? EmailNguoiNhan { get; set; }

        [Phone(ErrorMessage = "Số điện thoại người nhận không hợp lệ.")]
        public string? SDTNguoiNhan { get; set; }

        [StringLength(200, ErrorMessage = "Địa chỉ người nhận không được vượt quá 200 ký tự.")]
        public string? DiaChiNguoiNhan { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giảm giá phải lớn hơn hoặc bằng 0.")]
        public double GiamGia { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Khách thanh toán phải lớn hơn hoặc bằng 0.")]
        public decimal KhachThanhToan { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí vận chuyển phải lớn hơn hoặc bằng 0.")]
        public decimal PhiVanChuyen { get; set; }

        [StringLength(500, ErrorMessage = "Lý do khách hủy không được vượt quá 500 ký tự.")]
        public string? LyDoKhachHuy { get; set; }

        [StringLength(50, ErrorMessage = "Loại hóa đơn không được vượt quá 50 ký tự.")]
        public string? LoaiHoaDon { get; set; }

        [StringLength(50, ErrorMessage = "Phương thức thanh toán không được vượt quá 50 ký tự.")]
        public string? PhuongThucThanhToan { get; set; }

        public Guid? CustomerId { get; set; }
        public Guid? VoucherId { get; set; }
        public Guid? StaffId { get; set; }

        public virtual Customers? Customers { get; set; }
        public virtual Vouchers? Vouchers { get; set; }
        public virtual Staffs? Staffs { get; set; }

        [JsonIgnore]
        public virtual ICollection<BillDetails>? BillDetails { get; set; }
    }
}

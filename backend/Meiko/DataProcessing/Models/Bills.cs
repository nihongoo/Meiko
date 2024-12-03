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

        //True = giao hàng, False = tại quầy
        //[StringLength(50, ErrorMessage = "Loại hóa đơn không được vượt quá 50 ký tự.")]
        [Required(ErrorMessage = "Có giao hàng hay không?")]
        public bool? IsShipping { get; set; }

        [Required(ErrorMessage = "Tổng tiền không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0.")]
        public decimal Total { get; set; } = 0;

        [Required(ErrorMessage = "Ngày tạo không được để trống.")]
        public DateTime CreatedDate { get; set; }

        [Required(ErrorMessage = "Ngày giao hàng không được để trống.")]
        public DateTime? DeliveryDate { get; set; }

        [Required(ErrorMessage = "Ngày nhận hàng không được để trống.")]
        public DateTime? DateOfRecept { get; set; }

        [Required(ErrorMessage = "Ngày thanh toán không được để trống.")]
        public DateTime? PaymentDate { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        public StatusType Status { get; set; } = StatusType.TaoHoaDon;

        [Range(0, double.MaxValue, ErrorMessage = "Số tiền khách thanh toán phải lớn hơn hoặc bằng 0.")]
        public decimal PaymentAmount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí vận chuyển phải lớn hơn hoặc bằng 0.")]
        public decimal ShippingFee { get; set; }

        [StringLength(500, ErrorMessage = "Lý do khách hủy không được vượt quá 500 ký tự.")]
        public string? ReasonForCancellation { get; set; }

        public Guid? CustomerId { get; set; }
        public Guid? VoucherId { get; set; }
        public Guid? StaffId { get; set; }

        public virtual Customers? Customers { get; set; }
        public virtual Vouchers? Vouchers { get; set; }
        public virtual Staffs? Staffs { get; set; }

        [JsonIgnore]
        public virtual ICollection<BillDetails>? BillDetails { get; set; }
        public virtual ICollection<ShippingAddress>? ShippingAddresses { get; set; }
        public virtual ICollection<StatusHistory>? StatusHistories { get; set; }
        public virtual ICollection<PaymentHistory>? PaymentHistories { get; set; }
    }

    public enum StatusType
    {
        [Display(Name = "Tạo hoá đơn")]
        TaoHoaDon = 0,
		[Display(Name= "Chờ xử lý")]
		ChoXuly = 1,
		[Display(Name = "Đang chuẩn bị hàng")]
		DangChuanBiHang = 2,
		[Display(Name = "Đang giao hàng")]
		DangGiaoHang = 3,
		[Display(Name = "Đã giao tới")]
		DaGiaoToi = 4,
		[Display(Name = "Hoàn thành")]
		HoanThanh = 5,

        //Trạng thái cho trường hợp treo hoá đơn
		[Display(Name = "Chờ có hàng")]
		ChoCoHang = 6,
		[Display(Name = "Chờ người giao hàng")]
		ChoNguoiGiaoHang = 7,

		//Trạng thái cho trường hợp huỷ đơn
		[Display(Name = "Mất hàng")]
		MatHang = 8,
		[Display(Name = "Hoàn trả")]
		HoanTra = 9,
		[Display(Name = "Đã huỷ")]
		DaHuy = 10,
	}
}

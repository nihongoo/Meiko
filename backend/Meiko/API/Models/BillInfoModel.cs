using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
	public class BillInfoModel
	{

		[Required(ErrorMessage = "Mã hóa đơn không được để trống.")]
		[StringLength(50, ErrorMessage = "Mã hóa đơn không được vượt quá 50 ký tự.")]
		public string? BillCode { get; set; }

		//True = giao hàng, False = tại quầy
		//[StringLength(50, ErrorMessage = "Loại hóa đơn không được vượt quá 50 ký tự.")]
		[Required(ErrorMessage = "Có giao hàng hay không?")]
		public bool IsShipping { get; set; }

		[Required(ErrorMessage = "Tổng tiền không được để trống.")]
		[Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0.")]
		public double Total { get; set; } = 0;

		[Required(ErrorMessage = "Trạng thái không được để trống.")]
		public StatusType Status { get; set; } = StatusType.TaoHoaDon;

		[Range(0, double.MaxValue, ErrorMessage = "Số tiền khách thanh toán phải lớn hơn hoặc bằng 0.")]
		public decimal PaymentAmount { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Phí vận chuyển phải lớn hơn hoặc bằng 0.")]
		public decimal ShippingFee { get; set; }

		public Guid? CartId { get; set; }
		public Guid? CustomerId { get; set; }
		public Guid? VoucherId { get; set; }
		public Guid? StaffId { get; set; }
	}

	public class StatusInfo
	{
		[Required(ErrorMessage = "Trạng thái của hoá đơn không được để trống.")]
		public int StatusType { get; set; }
		public string? Note { get; set; }

		[Required(ErrorMessage = "Phải có ai đó đổi trạng thái hoá đơn, đúng chứ?")]
		public Guid StaffWhoCreatedThis { get; set; }
	}
}

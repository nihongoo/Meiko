using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
	public class BillInfoModel
	{
		public bool IsShipping { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0.")]
		public double Total { get; set; } = 0;

		public string? BillCode { get; set; }

		public StatusType Status { get; set; } = StatusType.TaoHoaDon;

		[Range(0, double.MaxValue, ErrorMessage = "Số tiền khách thanh toán phải lớn hơn hoặc bằng 0.")]
		public decimal PaymentAmount { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Phí vận chuyển phải lớn hơn hoặc bằng 0.")]
		public decimal ShippingFee { get; set; }
		public string BillType { get; set; }

		public Guid? CartId { get; set; }
		public Guid? CustomerId { get; set; }
		public Guid? VoucherId { get; set; }
		public Guid? StaffId { get; set; }
	}

	public class StatusInfo
	{
		public int StatusType { get; set; }
		public string? Note { get; set; }
		public Guid StaffWhoCreatedThis { get; set; }
	}
}

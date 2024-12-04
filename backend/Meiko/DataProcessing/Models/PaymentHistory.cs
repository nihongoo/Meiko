using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
	public class PaymentHistory
	{
		[Key]
		[Required(ErrorMessage = "Id trống rồi.")]
		public Guid Id { get; set; }
		[Required(ErrorMessage = "Ngày tạo không được để trống.")]
		public DateTime CreatedDate { get; set; }
		
		[Required(ErrorMessage = "Số tiền không được để trống.")]
		public decimal Amount { get; set; }

		[Required(ErrorMessage = "Phương thức thanh toán không được để trống.")]
		public PaymentMethods PaymentMethod { get; set; }

		[Required(ErrorMessage = "Trạng thái của hoá đơn không được để trống.")]
		public StatusForPayment Status { get; set; }

		[Required(ErrorMessage = "Không có hoá đơn sao có trạng thái hoá đơn.")]
		public Guid BillId { get; set; }
		public virtual Bills? Bill { get; set; }
	}

	public enum PaymentMethods
	{
		[Display(Name = "Tiền mặt")]
		TienMat = 0,
		[Display(Name = "Chuyển khoản")]
		NganHang = 1
	}

	public enum StatusForPayment
	{
		[Display(Name = "PAID")]
		Paid = 0,
		[Display(Name = "PENDING")]
		Pending = 1,
		[Display(Name = "PROCESSING")]
		Processing = 2,
		[Display(Name = "CANCELLED")]
		Cancelled = 3
	}
}

using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class BillDto
	{
		public Guid Id { get; set; }
		public string BillType { get; set; }
		public string? BillCode { get; set; }
		public bool? IsShipping { get; set; }
		public decimal Total { get; set; } = 0;
		public DateTime CreatedDate { get; set; }
		public DateTime? DeliveryDate { get; set; }
		public DateTime? DateOfRecept { get; set; }
		public DateTime? PaymentDate { get; set; }
		public string Status { get; set; } = string.Empty;
		public decimal PaymentAmount { get; set; }

		public decimal ShippingFee { get; set; }
		public string? ReasonForCancellation { get; set; }

		public Guid? CustomerId { get; set; }
		public Guid? VoucherId { get; set; }
		public Guid? StaffId { get; set; }

		public List<BillDetailDto>? BillDetails { get; set; }
		public List<ShippingAddressDto>? ShippingAddresses { get; set; }
		public List<StatusHistoryDto>? StatusHistories { get; set; }
		public List<PaymentHistoryDto>? PaymentHistories { get; set; }
		public VoucherDto? Voucherss { get; set; }
	}
}

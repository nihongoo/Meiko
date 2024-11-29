using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class PaymentHistoryDto
	{
		public Guid Id { get; set; }
		public DateTime CreatedDate { get; set; }
		public decimal Amount { get; set; }
		public string PaymentMethod { get; set; } = string.Empty;
		public string Status { get; set; } = string.Empty;
		public Guid? BillId { get; set; }
	}
}

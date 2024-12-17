using DataProcessing.Models;
using System.Text.Json.Serialization;

namespace API.DTO
{
	public class RefundItemDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public int Quantity { get; set; }
		public decimal Price { get; set; }
		public decimal Total { get; set; }
		public string Note { get; set; }
		public Guid RequestId { get; set; }
		[JsonIgnore]
		public virtual RequestRefund? RequestRefund { get; set; }
	}
}

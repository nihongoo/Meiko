using DataProcessing.Models;

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
		public virtual RequestRefund? RequestRefund { get; set; }
	}
}

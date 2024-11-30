using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class BillDetailDto
	{
		public Guid Id { get; set; }
		public int Quantity { get; set; }
		public decimal Price { get; set; }
		public int Status { get; set; }
		public Guid BillId { get; set; }
		public Guid ProductDetailId { get; set; }
	}
}

using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace API.DTO
{
	public class RequestRefundDto
	{
		public Guid Id { get; set; }
		public Guid requester { get; set; }
		public Guid BillId { get; set; }
		public DateTime CreateTime { get; set; }
		public StatusTypeRq Status { get; set; }
		public decimal AmountRefund { get; set; }
		public virtual ICollection<RefundItemDto>? RefundItems { get; set; }
	}
}

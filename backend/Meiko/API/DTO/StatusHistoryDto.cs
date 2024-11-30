using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class StatusHistoryDto
	{
		public Guid Id { get; set; }
		public DateTime CreatedDate { get; set; }
		public string StatusType { get; set; } = string.Empty;
		public string? Note { get; set; }
		public Guid WhoCreatedThis { get; set; }
		public Guid? BillId { get; set; }
	}
}

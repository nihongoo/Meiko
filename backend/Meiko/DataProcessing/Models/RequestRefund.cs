using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DataProcessing.Models
{
	public class RequestRefund
	{
		public Guid Id { get; set; }
		public Guid requester { get; set; }
		public Guid BillId { get; set; }
		public DateTime CreateTime { get; set; }
		public StatusTypeRq Status { get; set; }
		public decimal AmountRefund { get; set; }

		[JsonIgnore]
		public virtual ICollection<RefundItem>? RefundItems { get; set; }
	}
	public enum StatusTypeRq
	{
		[Display(Name = "Chờ xử lý")]
		ChoXuly = 1,
		[Display(Name = "Chấp nhận")]
		ChapNhan = 2,
		[Display(Name = "Từ chối")]
		TuChoi = 3,
	}
}

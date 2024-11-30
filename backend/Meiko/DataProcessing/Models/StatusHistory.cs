using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
	public class StatusHistory
	{
		[Key]
		[Required(ErrorMessage = "Id trống rồi.")]
		public Guid Id { get; set; }
		[Required(ErrorMessage = "Ngày tạo không được để trống.")]
		public DateTime CreatedDate { get; set; }
		[Required(ErrorMessage = "Trạng thái của hoá đơn không được để trống.")]
		public StatusType StatusType { get; set; }
		public string? Note { get; set; }

		[Required(ErrorMessage = "Phải có ai đó đổi trạng thái hoá đơn, đúng chứ?")]
		public Guid WhoCreatedThis { get; set; }

		[Required(ErrorMessage = "Không có hoá đơn sao có trạng thái hoá đơn.")]
		public Guid BillId { get; set; }
		public virtual Bills? Bill { get; set; }
	}
}

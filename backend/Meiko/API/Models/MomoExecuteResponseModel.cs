using System.ComponentModel.DataAnnotations;

namespace API.Models
{
	public class MomoExecuteResponseModel
	{
		//public int Id { get; set; } // ID giao dịch trong cơ sở dữ liệu
		//public string PartnerCode { get; set; }
		//public string AccessKey { get; set; }
		//public string RequestId { get; set; }
		//public string OrderId { get; set; }
		//public string OrderInfo { get; set; }
		//public string Amount { get; set; }
		//public string OrderType { get; set; }
		//public string TransId { get; set; }
		//public int ErrorCode { get; set; }
		//public string Message { get; set; }
		//public string LocalMessage { get; set; }
		//public DateTime ResponseTime { get; set; }
		//public string ExtraData { get; set; }
		//public string Signature { get; set; }
		[Required]
		public string PartnerCode { get; set; } // Mã đối tác

		[Required]
		public string OrderId { get; set; } // Mã đơn hàng

		[Required]
		public string RequestId { get; set; } // Mã yêu cầu giao dịch

		[Required]
		public long Amount { get; set; } // Số tiền giao dịch (VND)

		public string OrderInfo { get; set; } // Thông tin mô tả đơn hàng

		public string OrderType { get; set; } // Loại giao dịch

		[Required]
		public string TransId { get; set; } // Mã giao dịch MoMo

		[Required]
		public int ResultCode { get; set; } // Mã kết quả giao dịch (0: thành công)

		public string Message { get; set; } // Mô tả trạng thái giao dịch

		[Required]
		public string Signature { get; set; } // Chữ ký xác thực
	}
}

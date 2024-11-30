namespace API.Models
{
	public class MomoExecuteResponseModel
	{
		public int Id { get; set; } // ID giao dịch trong cơ sở dữ liệu
		public string PartnerCode { get; set; }
		public string AccessKey { get; set; }
		public string RequestId { get; set; }
		public string OrderId { get; set; }
		public string OrderInfo { get; set; }
		public string Amount { get; set; }
		public string OrderType { get; set; }
		public string TransId { get; set; }
		public int ErrorCode { get; set; }
		public string Message { get; set; }
		public string LocalMessage { get; set; }
		public DateTime ResponseTime { get; set; }
		public string ExtraData { get; set; }
		public string Signature { get; set; }
	}
}

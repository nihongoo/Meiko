using API.DTO;
using API.Models;
using DataProcessing.Models;

namespace API.IServices
{
	public interface IBillServices
	{
		// Hiển thị
		Task<List<BillDto>> GetBills();
		Task<List<BillDto>> GetBillsByCustomerId(Guid CustomerId);
		Task<BillDto> GetBillById(Guid BillId);

		Task<List<BillDetailDto>> GetBillDetails();
		Task<List<BillDetailDto>> GetBillDetailsByBillId(Guid BillId);
		Task<BillDetailDto> GetBillDetailById(Guid Id);

		Task<List<ShippingAddressDto>> GetShippingAddresses();
		Task<List<ShippingAddressDto>> GetShippingAddressesByBillId(Guid BillId);
		Task<ShippingAddressDto> GetShippingAddressById(Guid Id);

		Task<List<StatusHistoryDto>> GetStatusHistories();
		Task<List<StatusHistoryDto>> GetStatusHistoriesByBillId(Guid BillId);
		Task<StatusHistoryDto> GetStatusHistoryById(Guid Id);

		Task<List<PaymentHistoryDto>> GetPaymentHistories();
		Task<List<PaymentHistoryDto>> GetPaymentHistoriesByBillId(Guid BillId);
		Task<PaymentHistoryDto> GetPaymentHistoryById(Guid Id); 

		// Xử lý
		//Bill
		Task<bool> Create(string BillCode, bool IsShiping, decimal ShippingFee, Guid? StaffWhoCreateThis, Guid? CustomerWhoCreateThis, Guid? CartId, Guid? VoucherId); // Từ giỏ hàng lấy những sản phẩm trong giỏ hàng.
		Task<bool> Delete(Guid Id);
		Task<bool> ChangeStatusTo(Guid BillId, int Status, string? note, Guid UserWhoCreateThis);

		//ShippingAddress
		Task<bool> AddAddressToBill(ShippingAddressInfoModel model);
		Task EditAddress(Guid Id, ShippingAddressInfoModel model);

		Task DeleteAddress(Guid Id);

		//PaymentHistory
		Task<bool> Pay(decimal AmountInput, int PaymentMethod, int Status, Guid BillId);
		Task<bool> DeletePaymentById(Guid id, bool confirmDelete);

		//BillDetails
		Task<bool> AddToBill(BillDetailInfoModel model);
		Task<bool> AddQuantity(Guid Id, int Quantity); // Thêm số lượng sản phẩm, vd: +1 hoặc -1
		Task<bool> ChangeQuantityFor(Guid Id, int Quantity); // Đổi số lượng sản phẩm bằng với Quantity nhập vào
		
		//MomoAPI
		Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(OrderInfoModel model);
		Task<MomoExecuteResponseModel> PaymentExecuteAsync(IQueryCollection collection);
	}
}

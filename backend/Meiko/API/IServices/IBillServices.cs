using API.DTO;
using API.Models;
using API.ViewModel;
using DataProcessing.Models;
using Net.payOS.Types;

namespace API.IServices
{
	public interface IBillServices
	{
		// Hiển thị
		Task<List<BillDto>> GetBills();
		Task<List<BillDto>> GetBillsByCustomerId(Guid CustomerId);
		Task<BillDto> GetBillById(Guid BillId);
		Task<BillDto> GetBillByStatus(int status);

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

		Task<List<BillDto>> Filter (DateTime StartDay, DateTime EndDay);

		// Xử lý
		//Bill
		Task<ReturnMessage> Delete(Guid Id);
		Task<ReturnMessage> ChangeStatusTo(Guid BillId, int Status, string? note, Guid UserWhoCreateThis);
		Task<(bool k, Guid id)> Create(bool IsShiping, decimal ShippingFee, Guid? StaffWhoCreateThis, Guid? CustomerWhoCreateThis, Guid? CartId, Guid? VoucherId); // Từ giỏ hàng lấy những sản phẩm trong giỏ hàng.

		//ShippingAddress
		Task<ReturnMessage> AddAddressToBill(ShippingAddressInfoModel model);
		Task<ReturnMessage> EditAddress(Guid Id, ShippingAddressInfoModel model);

		Task<ReturnMessage> DeleteAddress(Guid Id);

		//PaymentHistory
		Task<ReturnMessage> Pay(decimal AmountInput, int PaymentMethod, int Status, Guid BillId);
		Task<ReturnMessage> CancelPaymentById(Guid id, long billCode);

		//BillDetails
		Task<ReturnMessage> AddToBill(BillDetailInfoModel model);
		Task<ReturnMessage> AddQuantity(Guid Id, int Quantity); // Thêm số lượng sản phẩm, vd: +1 hoặc -1
		Task<ReturnMessage> ChangeQuantityFor(Guid Id, int Quantity); // Đổi số lượng sản phẩm bằng với Quantity nhập vào
		Task<List<ListBillDetailViewModel>> listBillDetails(Guid id);
		Task<(bool k, string msg)> DeleteBillDetail(Guid Id);
		
		//Momo API
		Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(Guid id, string description);
		Task<MomoExecuteResponseModel> PaymentExecuteAsync(IQueryCollection collection);

		//PayOS API
		Task<CreatePaymentResult> CreatePayOSRequestAsync(Guid id, string description);
	}
}

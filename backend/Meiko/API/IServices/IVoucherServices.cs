using API.Models;
using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IVoucherServices
    {
        public Task<Vouchers> CreateVoucherAsync (VoucherViewModel voucherViewModel);
        public Task<Vouchers?> GetVoucherByIdAsync(Guid id);
        public Task<List<Vouchers>> GetAllVouchersAsync();
        public Task<ReturnMessage> UpdateVoucherStatus(Guid id);
        public Task DeleteVoucherAsync(Guid id);
        public Task<List<Vouchers>> Filter(DateTime startDate, DateTime endDate);
    }
}

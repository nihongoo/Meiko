using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IVoucherServices
    {
        public Task<Vouchers> CreateVoucherAsync (VoucherViewModel voucherViewModel);
        public Task<Vouchers?> GetVoucherByIdAsync(Guid id);
        public Task<List<Vouchers>> GetAllVouchersAsync();
        public Task<bool> UseVoucherAsync(Guid voucherId, Guid customerId, double billAmount);
        public Task DeleteVoucherAsync(Guid id);
    }
}

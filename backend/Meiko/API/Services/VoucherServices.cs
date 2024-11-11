using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class VoucherServices : IVoucherServices
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        public VoucherServices(AppDbContext appDbContext, IEmailService emailService)
        {
            _context = appDbContext;
            _emailService = emailService;

        }

        public async Task<Vouchers> CreateVoucherAsync(VoucherViewModel voucherViewModel)
        {
            var voucher = new Vouchers
            {
                Id = Guid.NewGuid(),
                VoucherCode = voucherViewModel.VoucherCode,
                Value = voucherViewModel.Value,
                MinimumOrderAmount = voucherViewModel.MinimumOrderAmount,
                Quantity = voucherViewModel.Quantity,
                StartDay = voucherViewModel.StartDay,
                EndDay = voucherViewModel.EndDay,
                Status = 0,
                IsPublic = voucherViewModel.IsPublic,
            };

            _context.Vouchers.Add(voucher);

            // Kiểm tra nếu voucher không công khai
            if (!voucher.IsPublic && voucherViewModel.CustomerIds != null && voucherViewModel.CustomerIds.Count > 0)
            {
                foreach (var customerId in voucherViewModel.CustomerIds)
                {
                    var voucherDetail = new VoucherDetails
                    {
                        Id = Guid.NewGuid(),
                        VoucherId = voucher.Id,
                        CustomerId = customerId,
                        Status = 0 // Chưa sử dụng
                    };
                    _context.VoucherDetails.Add(voucherDetail);

                    // Lấy thông tin khách hàng để gửi email
                    var customer = await _context.Customers.FindAsync(customerId);
                    if (customer != null)
                    {
                        await _emailService.SendVoucherEmailAsync(customer.Email, "Thông báo Voucher mới", voucher, customer.Email);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return voucher;
        }

        public async Task DeleteVoucherAsync(Guid id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher != null)
            {
                _context.Vouchers.Remove(voucher);
                _context.VoucherDetails.RemoveRange(_context.VoucherDetails.Where(vd => vd.VoucherId == id));
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Vouchers>> GetAllVouchersAsync()
        {
            return await _context.Vouchers.ToListAsync();
        }

        public async Task<Vouchers?> GetVoucherByIdAsync(Guid id)
        {
            return await _context.Vouchers.FindAsync(id);
        }

        public async Task<bool> UseVoucherAsync(Guid voucherId, Guid customerId, double billAmount)
        {
            var voucher = await _context.Vouchers.FindAsync(voucherId);
            if (voucher == null)
            {
                Console.WriteLine("Voucher không tồn tại.");
                return false;
            }

            if (voucher.Quantity <= 0)
            {
                Console.WriteLine("Voucher không còn lượt sử dụng.");
                return false;
            }

            if (DateTime.Now > voucher.EndDay)
            {
                Console.WriteLine("Voucher đã hết hạn.");
                return false;
            }

            if (billAmount < voucher.MinimumOrderAmount)
            {
                Console.WriteLine($"Yêu cầu số tiền hóa đơn tối thiểu là {voucher.MinimumOrderAmount}");
                return false;
            }

            if (!voucher.IsPublic)
            {
                var voucherDetail = await _context.VoucherDetails
                    .FirstOrDefaultAsync(vd => vd.VoucherId == voucherId && vd.CustomerId == customerId);

                if (voucherDetail == null)
                {
                    Console.WriteLine("Voucher này không áp dụng cho khách hàng này.");
                    return false;
                }

                voucherDetail.Status = 1; // Đánh dấu voucher đã sử dụng
            }

            voucher.Quantity--; // Giảm số lượng voucher còn lại
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

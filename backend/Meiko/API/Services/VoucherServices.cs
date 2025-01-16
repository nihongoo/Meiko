using API.IServices;
using API.Models;
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
            // Kiểm tra trùng mã voucher
            var existingVoucher = await _context.Vouchers
                .AsNoTracking() // Không theo dõi entity vì chỉ cần kiểm tra
                .FirstOrDefaultAsync(v => v.VoucherCode == voucherViewModel.VoucherCode);

            if (existingVoucher != null)
            {
                throw new Exception($"Voucher code '{voucherViewModel.VoucherCode}' đã tồn tại.");
            }

            var voucher = new Vouchers
            {
                Id = Guid.NewGuid(),
                VoucherCode = voucherViewModel.VoucherCode,
                Value = voucherViewModel.Value,
                MinimumOrderAmount = voucherViewModel.MinimumOrderAmount,
                StartDay = voucherViewModel.StartDay,
                EndDay = voucherViewModel.EndDay,
                Status = 0,
                IsPublic = voucherViewModel.IsPublic,
            };

            _context.Vouchers.Add(voucher);

            if (voucher.IsPublic) // Khi là voucher công khai
            {
                var allCustomers = await _context.Customers.ToListAsync();
                var emailTasks = new List<Task>();

                foreach (var customer in allCustomers)
                {
                    var voucherDetail = new VoucherDetails
                    {
                        Id = Guid.NewGuid(),
                        VoucherId = voucher.Id,
                        CustomerId = customer.Id,
                        Status = 0
                    };
                    _context.VoucherDetails.Add(voucherDetail);
                    emailTasks.Add(_emailService.SendVoucherEmailAsync(customer.Email, "Thông báo Voucher mới", voucher, customer.Email));
                }

                await Task.WhenAll(emailTasks);
            }
            else if (voucherViewModel.CustomerIds != null && voucherViewModel.CustomerIds.Any())
            {
                foreach (var customerId in voucherViewModel.CustomerIds)
                {
                    var voucherDetail = new VoucherDetails
                    {
                        Id = Guid.NewGuid(),
                        VoucherId = voucher.Id,
                        CustomerId = customerId,
                        Status = 0
                    };
                    _context.VoucherDetails.Add(voucherDetail);
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

		public async Task<List<Vouchers>> Filter(DateTime startDate, DateTime endDate)
		{
            return await _context.Vouchers.Where(v => v.StartDay >= startDate && v.EndDay <= endDate).ToListAsync();
		}

		public async Task<List<Vouchers>> GetAllVouchersAsync()
        {
            return await _context.Vouchers.ToListAsync();
        }

        public async Task<Vouchers?> GetVoucherByIdAsync(Guid id)
        {
            return await _context.Vouchers.FindAsync(id);
        }
        public async Task<ReturnMessage> UpdateVoucherStatus(Guid id)
        {
            using (var dbTransaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Tìm voucher detail theo ID
                    var voucherDetail = await _context.VoucherDetails.FindAsync(id);
                    if (voucherDetail == null)
                    {
                        return new ReturnMessage()
                        {
                            status = 1,
                            message = "Voucher không tồn tại."
                        };
                    }

                    // Kiểm tra trạng thái hiện tại
                    if (voucherDetail.Status != 0)
                    {
                        return new ReturnMessage()
                        {
                            status = 1,
                            message = "Chỉ có thể cập nhật trạng thái từ 0 (chưa dùng) sang 1 (đã dùng)."
                        };
                    }

                    // Cập nhật trạng thái sang 1
                    voucherDetail.Status = 1;

                    // Lưu thay đổi
                    _context.VoucherDetails.Update(voucherDetail);
                    await _context.SaveChangesAsync();

                    await dbTransaction.CommitAsync();

                    return new ReturnMessage()
                    {
                        status = 0,
                        message = "Cập nhật trạng thái voucher thành công."
                    };
                }
                catch (Exception ex)
                {
                    await dbTransaction.RollbackAsync();

                    return new ReturnMessage()
                    {
                        status = 2,
                        message = $"Đã xảy ra lỗi: {ex.Message}"
                    };
                }
            }
        }
    }

}

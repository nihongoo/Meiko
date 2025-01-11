using API;
using API.DTO;
using API.IServices;
using API.Models;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Net.payOS;
using Net.payOS.Types;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Crmf;
using RestSharp;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
	public class BillServices : IBillServices
	{
		private readonly AppDbContext _dbcontext;
		private readonly ICartDetailServices _cartDetailServices;
		private readonly string _apiKey;
		private readonly string _checkSum;
		private readonly string _clientId;
		public BillServices(AppDbContext context, ICartDetailServices cartDetailServices, IConfiguration configuration)
		{
			_dbcontext = context;
			_cartDetailServices = cartDetailServices;
			_apiKey = configuration["PayOS:ApiKey"];
			_checkSum = configuration["PayOS:CheckSumKey"];
			_clientId = configuration["PayOS:ClientId"];
		}

		//View
		public async Task<BillDto?> GetBillById(Guid BillId)
		{
			using (var context = _dbcontext)
			{
				// Truy vấn hóa đơn kèm bảng phụ
				var bills = await context.Bills.Where(b => b.Id == BillId)
					.Include(b => b.BillDetails)
					.Include(b => b.ShippingAddresses)
					.Include(b => b.StatusHistories)
					.Include(b => b.PaymentHistories)
					.Include(b => b.Vouchers)
					.Select(b => new BillDto
					{
						Id = b.Id,
						BillType = b.BillType,
						BillCode = b.BillCode,
						IsShipping = b.IsShipping,
						Total = b.Total,
						CreatedDate = b.CreatedDate,
						DeliveryDate = b.DeliveryDate,
						DateOfRecept = b.DateOfRecept,
						PaymentDate = b.PaymentDate,
						Status = b.Status.GetDisplayName(),
						PaymentAmount = b.PaymentAmount,
						ShippingFee = b.ShippingFee,
						ReasonForCancellation = b.ReasonForCancellation,

						CustomerId = b.CustomerId,
						VoucherId = b.VoucherId,
						StaffId = b.StaffId,

						// Ánh xạ bảng con

						Voucherss = b.Vouchers != null ? new VoucherDto
						{
							Id = b.Vouchers.Id,
							VoucherCode = b.Vouchers.VoucherCode,
							Value = b.Vouchers.Value,
							MinimumOrderAmount = b.Vouchers.MinimumOrderAmount,
							Quantity = b.Vouchers.Quantity,
							StartDay = b.Vouchers.StartDay,
							EndDay = b.Vouchers.EndDay,
							Status = b.Vouchers.Status,
							IsPublic = b.Vouchers.IsPublic
						} : null,

						BillDetails = b.BillDetails.Select(d => new BillDetailDto
						{
							Id = d.Id,
							BillId = d.BillId,
							ProductDetailId = d.ProductDetailId,
							Quantity = d.Quantity,
							Price = d.Price,
							Status = d.Status
						}).ToList(),

						ShippingAddresses = b.ShippingAddresses.Select(a => new ShippingAddressDto
						{
							Id = a.Id,
							BillId = a.BillId,
							RecipientName = a.RecipientName,
							AddressDetail = a.RecipientName,
							PhoneNumber = a.PhoneNumber,
							City = a.City,
							District = a.District,
							Ward = a.Ward,
							Status = a.Status
						}).ToList(),

						PaymentHistories = b.PaymentHistories.Select(c => new PaymentHistoryDto
						{
							Id = c.Id,
							Amount = c.Amount,
							CreatedDate = c.CreatedDate,
							PaymentMethod = c.PaymentMethod.GetDisplayName(),
							Status = c.Status.GetDisplayName(),
							BillId = c.BillId
						}).ToList(),

						StatusHistories = b.StatusHistories.Select(c => new StatusHistoryDto
						{
							Id = c.Id,
							CreatedDate = c.CreatedDate,
							StatusType = c.StatusType.GetDisplayName(),
							Note = c.Note,
							WhoCreatedThis = c.WhoCreatedThis,
							BillId = c.BillId
						}).ToList()
					}).FirstOrDefaultAsync();

				return bills;
			}
		}

		public async Task<BillDto?> GetBillByStatus(int status)
		{
			using (var context = _dbcontext)
			{
				// Truy vấn hóa đơn kèm bảng phụ
				var bills = await context.Bills.Where(b => b.Status == (StatusType)status)
					.Include(b => b.BillDetails)
					.Include(b => b.ShippingAddresses)
					.Include(b => b.StatusHistories)
					.Include(b => b.PaymentHistories)
					.Select(b => new BillDto
					{
						Id = b.Id,
						BillType = b.BillType,
						BillCode = b.BillCode,
						IsShipping = b.IsShipping,
						Total = b.Total,
						CreatedDate = b.CreatedDate,
						DeliveryDate = b.DeliveryDate,
						DateOfRecept = b.DateOfRecept,
						PaymentDate = b.PaymentDate,
						Status = b.Status.GetDisplayName(),
						PaymentAmount = b.PaymentAmount,
						ShippingFee = b.ShippingFee,
						ReasonForCancellation = b.ReasonForCancellation,

						CustomerId = b.CustomerId,
						VoucherId = b.VoucherId,
						StaffId = b.StaffId,

						// Ánh xạ bảng con
						BillDetails = b.BillDetails.Select(d => new BillDetailDto
						{
							Id = d.Id,
							BillId = d.BillId,
							ProductDetailId = d.ProductDetailId,
							Quantity = d.Quantity,
							Price = d.Price,
							Status = d.Status
						}).ToList(),

						ShippingAddresses = b.ShippingAddresses.Select(a => new ShippingAddressDto
						{
							Id = a.Id,
							BillId = a.BillId,
							RecipientName = a.RecipientName,
							AddressDetail = a.RecipientName,
							PhoneNumber = a.PhoneNumber,
							City = a.City,
							District = a.District,
							Ward = a.Ward,
							Status = a.Status
						}).ToList(),

						PaymentHistories = b.PaymentHistories.Select(c => new PaymentHistoryDto
						{
							Id = c.Id,
							Amount = c.Amount,
							CreatedDate = c.CreatedDate,
							PaymentMethod = c.PaymentMethod.GetDisplayName(),
							Status = c.Status.GetDisplayName(),
							BillId = c.BillId
						}).ToList(),

						StatusHistories = b.StatusHistories.Select(c => new StatusHistoryDto
						{
							Id = c.Id,
							CreatedDate = c.CreatedDate,
							StatusType = c.StatusType.GetDisplayName(),
							Note = c.Note,
							WhoCreatedThis = c.WhoCreatedThis,
							BillId = c.BillId
						}).ToList()
					}).FirstOrDefaultAsync();

				return bills;
			}
		}

		public async Task<BillDetailDto?> GetBillDetailById(Guid Id)
		{
			using (var context = _dbcontext)
			{
				var billDetails = await context.BillDetails.Where(b => b.Id == Id)
					.Select(bd => new BillDetailDto
					{
						Id = bd.Id,
						BillId = bd.BillId,
						ProductDetailId = bd.ProductDetailId,
						Quantity = bd.Quantity,
						Price = bd.Price,
						Status = bd.Status
					}).FirstOrDefaultAsync();

				return billDetails;
			}
		}

		public async Task<List<BillDetailDto>> GetBillDetails()
		{
			using (var context = _dbcontext)
			{
				var billDetails = await context.BillDetails
					.Select(bd => new BillDetailDto
					{
						Id = bd.Id,
						BillId = bd.BillId,
						ProductDetailId = bd.ProductDetailId,
						Quantity = bd.Quantity,
						Price = bd.Price,
						Status = bd.Status
					}).ToListAsync();

				return billDetails;
			}
		}

		public async Task<List<BillDetailDto>> GetBillDetailsByBillId(Guid BillId)
		{
			using (var context = _dbcontext)
			{
				var billDetails = await context.BillDetails.Where(b => b.BillId == BillId)
					.Select(bd => new BillDetailDto
					{
						Id = bd.Id,
						BillId = bd.BillId,
						ProductDetailId = bd.ProductDetailId,
						Quantity = bd.Quantity,
						Price = bd.Price,
						Status = bd.Status
					}).ToListAsync();

				return billDetails;
			}
		}

		public async Task<List<BillDto>> GetBills()
		{
			using (var context = _dbcontext)
			{
				// Truy vấn hóa đơn kèm bảng phụ
				var bills = await context.Bills
					.Include(b => b.BillDetails)
					.Include(b => b.ShippingAddresses) 
					.Include(b => b.StatusHistories)
					.Include(b => b.PaymentHistories)
					.OrderByDescending(b => b.CreatedDate) // Add this line to sort by newest first
					.Select(b => new BillDto
					{
						Id = b.Id,
						BillType = b.BillType,
						BillCode = b.BillCode,
						IsShipping = b.IsShipping,
						Total = b.Total,
						CreatedDate = b.CreatedDate,
						DeliveryDate = b.DeliveryDate,
						DateOfRecept = b.DateOfRecept,
						PaymentDate = b.PaymentDate,
						Status = b.Status.GetDisplayName(),
						PaymentAmount = b.PaymentAmount,
						ShippingFee = b.ShippingFee,
						ReasonForCancellation = b.ReasonForCancellation,

						CustomerId = b.CustomerId,
						VoucherId = b.VoucherId,
						StaffId = b.StaffId,

						// Ánh xạ bảng con
						BillDetails = b.BillDetails.Select(d => new BillDetailDto
						{
							Id = d.Id,
							BillId = d.BillId,
							ProductDetailId = d.ProductDetailId,
							Quantity = d.Quantity,
							Price = d.Price,
							Status = d.Status
						}).ToList(),

						ShippingAddresses = b.ShippingAddresses.Select(a => new ShippingAddressDto
						{
							Id = a.Id,
							BillId = a.BillId,
							RecipientName = a.RecipientName,
							AddressDetail = a.RecipientName,
							PhoneNumber = a.PhoneNumber,
							City = a.City,
							District = a.District,
							Ward = a.Ward,
							Status = a.Status
						}).ToList(),

						PaymentHistories = b.PaymentHistories.Select(c => new PaymentHistoryDto
						{
							Id = c.Id,
							Amount = c.Amount,
							CreatedDate = c.CreatedDate,
							PaymentMethod = c.PaymentMethod.GetDisplayName(),
							Status = c.Status.GetDisplayName(),
							BillId = c.BillId
						}).ToList(),

						StatusHistories = b.StatusHistories.Select(c => new StatusHistoryDto
						{
							Id = c.Id,
							CreatedDate = c.CreatedDate,
							StatusType = c.StatusType.GetDisplayName(),
							Note = c.Note,
							WhoCreatedThis = c.WhoCreatedThis,
							BillId = c.BillId
						}).ToList()
					}).ToListAsync();

				return bills;
			}
		}

		public async Task<List<BillDto>> GetBillsByCustomerId(Guid CustomerId)
		{
			using (var context = _dbcontext)
			{
				// Truy vấn hóa đơn kèm bảng phụ
				var bills = await context.Bills.Where(b => b.CustomerId == CustomerId)
					.Include(b => b.BillDetails)
					.Include(b => b.ShippingAddresses)
					.Include(b => b.StatusHistories)
					.Include(b => b.PaymentHistories)
					.Select(b => new BillDto
					{
						Id = b.Id,
						BillType = b.BillType,
						BillCode = b.BillCode,
						IsShipping = b.IsShipping,
						Total = b.Total,
						CreatedDate = b.CreatedDate,
						DeliveryDate = b.DeliveryDate,
						DateOfRecept = b.DateOfRecept,
						PaymentDate = b.PaymentDate,
						Status = b.Status.GetDisplayName(),
						PaymentAmount = b.PaymentAmount,
						ShippingFee = b.ShippingFee,
						ReasonForCancellation = b.ReasonForCancellation,

						CustomerId = b.CustomerId,
						VoucherId = b.VoucherId,
						StaffId = b.StaffId,

						// Ánh xạ bảng con
						BillDetails = b.BillDetails.Select(d => new BillDetailDto
						{
							Id = d.Id,
							BillId = d.BillId,
							ProductDetailId = d.ProductDetailId,
							Quantity = d.Quantity,
							Price = d.Price,
							Status = d.Status
						}).ToList(),

						ShippingAddresses = b.ShippingAddresses.Select(a => new ShippingAddressDto
						{
							Id = a.Id,
							BillId = a.BillId,
							RecipientName = a.RecipientName,
							AddressDetail = a.RecipientName,
							PhoneNumber = a.PhoneNumber,
							City = a.City,
							District = a.District,
							Ward = a.Ward,
							Status = a.Status
						}).ToList(),

						PaymentHistories = b.PaymentHistories.Select(c => new PaymentHistoryDto
						{
							Id = c.Id,
							Amount = c.Amount,
							PaymentMethod = c.PaymentMethod.GetDisplayName(),
							Status = c.Status.GetDisplayName(),
							BillId = c.BillId
						}).ToList(),

						StatusHistories = b.StatusHistories.Select(c => new StatusHistoryDto
						{
							Id = c.Id,
							CreatedDate = c.CreatedDate,
							StatusType = c.StatusType.GetDisplayName(),
							Note = c.Note,
							WhoCreatedThis = c.WhoCreatedThis,
							BillId = c.BillId
						}).ToList()
					}).ToListAsync();

				return bills;
			}
		}

		public async Task<List<PaymentHistoryDto>> GetPaymentHistories()
		{
			using (var context = _dbcontext)
			{
				var paymentHistories = await context.PaymentHistories
					.Select(c => new PaymentHistoryDto
					{
						Id = c.Id,
						Amount = c.Amount,
						PaymentMethod = c.PaymentMethod.GetDisplayName(),
						Status = c.Status.GetDisplayName(),
						BillId = c.BillId
					}).ToListAsync();

				return paymentHistories;
			}
		}

		public async Task<List<PaymentHistoryDto>> GetPaymentHistoriesByBillId(Guid BillId)
		{
			using (var context = _dbcontext)
			{
				var paymentHistories = await context.PaymentHistories.Where(ph => ph.BillId == BillId)
					.Select(c => new PaymentHistoryDto
					{
						Id = c.Id,
						Amount = c.Amount,
						CreatedDate = c.CreatedDate,
						PaymentMethod = c.PaymentMethod.GetDisplayName(),
						Status = c.Status.GetDisplayName(),
						BillId = c.BillId
					}).ToListAsync();

				return paymentHistories;
			}
		}

		public async Task<PaymentHistoryDto?> GetPaymentHistoryById(Guid Id)
		{
			using (var context = _dbcontext)
			{
				var paymentHistory = await context.PaymentHistories.Where(ph => ph.Id == Id)
					.Select(c => new PaymentHistoryDto
					{
						Id = c.Id,
						Amount = c.Amount,
						PaymentMethod = c.PaymentMethod.GetDisplayName(),
						Status = c.Status.GetDisplayName(),
						BillId = c.BillId
					}).FirstOrDefaultAsync();

				return paymentHistory;
			}
		}

		public async Task<ShippingAddressDto?> GetShippingAddressById(Guid Id)
		{
			using (var context = _dbcontext)
			{
				var shippingAddress = await context.ShippingAddresses.Where(sa => sa.Id == Id)
					.Select(a => new ShippingAddressDto
					{
						Id = a.Id,
						BillId = a.BillId,
						RecipientName = a.RecipientName,
						AddressDetail = a.RecipientName,
						PhoneNumber = a.PhoneNumber,
						City = a.City,
						District = a.District,
						Ward = a.Ward,
						Status = a.Status
					}).FirstOrDefaultAsync();

				return shippingAddress;
			}
		}

		public async Task<List<ShippingAddressDto>> GetShippingAddresses()
		{
			using (var context = _dbcontext)
			{
				var shippingAddresses = await context.ShippingAddresses
					.Select(a => new ShippingAddressDto
					{
						Id = a.Id,
						BillId = a.BillId,
						RecipientName = a.RecipientName,
						AddressDetail = a.RecipientName,
						PhoneNumber = a.PhoneNumber,
						City = a.City,
						District = a.District,
						Ward = a.Ward,
						Status = a.Status
					}).ToListAsync();

				return shippingAddresses;
			}
		}

		public async Task<List<ShippingAddressDto>> GetShippingAddressesByBillId(Guid BillId)
		{
			using (var context = _dbcontext)
			{
				var shippingAddresses = await context.ShippingAddresses.Where(sa => sa.BillId == BillId)
					.Select(a => new ShippingAddressDto
					{
						Id = a.Id,
						BillId = a.BillId,
						RecipientName = a.RecipientName,
						AddressDetail = a.RecipientName,
						PhoneNumber = a.PhoneNumber,
						City = a.City,
						District = a.District,
						Ward = a.Ward,
						Status = a.Status
					}).ToListAsync();

				return shippingAddresses;
			}
		}

		public async Task<List<StatusHistoryDto>> GetStatusHistories()
		{
			using (var context = _dbcontext)
			{
				var statusHistories = await context.StatusHistories
					.Select(c => new StatusHistoryDto
					{
						Id = c.Id,
						CreatedDate = c.CreatedDate,
						StatusType = c.StatusType.GetDisplayName(),
						Note = c.Note,
						WhoCreatedThis = c.WhoCreatedThis,
						BillId = c.BillId
					}).ToListAsync();

				return statusHistories;
			}
		}

		public async Task<List<StatusHistoryDto>> GetStatusHistoriesByBillId(Guid BillId)
		{
			using (var context = _dbcontext)
			{
				var statusHistories = await context.StatusHistories.Where(sh => sh.BillId == BillId)
					.Select(c => new StatusHistoryDto
					{
						Id = c.Id,
						CreatedDate = c.CreatedDate,
						StatusType = c.StatusType.GetDisplayName(),
						Note = c.Note,
						WhoCreatedThis = c.WhoCreatedThis,
						BillId = c.BillId
					}).ToListAsync();

				return statusHistories;
			}
		}

		public async Task<StatusHistoryDto?> GetStatusHistoryById(Guid Id)
		{
			using (var context = _dbcontext)
			{
				var statusHistory = await context.StatusHistories.Where(sh => sh.Id == Id)
					.Select(c => new StatusHistoryDto
					{
						Id = c.Id,
						CreatedDate = c.CreatedDate,
						StatusType = c.StatusType.GetDisplayName(),
						Note = c.Note,
						WhoCreatedThis = c.WhoCreatedThis,
						BillId = c.BillId
					}).FirstOrDefaultAsync();

				return statusHistory;
			}
		}


        // Bill
        public async Task<(bool k, Guid? id, string message)> Create(bool IsShipping, decimal ShippingFee, Guid? StaffWhoCreateThis, Guid? CustomerWhoCreateThis, Guid? CartId, Guid? VoucherId, string billcode, string billtype)
        {
            bool check = false;
            Guid billId = Guid.Empty;
            Guid Id;
			var message = new List<string>();

            using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
            {
                try
                {
                    Bills bill = new Bills()
                    {
                        Id = Guid.NewGuid(),
                        BillCode = billcode,
                        IsShipping = IsShipping,
                        Total = 0,
                        CreatedDate = DateTime.Now,
                        Status = StatusType.TaoHoaDon,
                        PaymentAmount = 0,
                        ShippingFee = ShippingFee,
                        CustomerId = CustomerWhoCreateThis ?? StaffWhoCreateThis,
                        StaffId = StaffWhoCreateThis,
                        VoucherId = VoucherId
                    };

					await _dbcontext.Bills.AddAsync(bill);
					billId = bill.Id;

					if (CartId != null)
					{
						List<CartDetails>? cartDetails = await _dbcontext.CartDetails
							.Where(cd => cd.CartId == CartId)
							.Include(cd => cd.ProductDetails)
							.ThenInclude(pd => pd.SaleProducts)
							.Include(cd=>cd.ProductDetails)
							.ThenInclude(pd => pd.Products)
							.ToListAsync();

						if (cartDetails != null)
						{
							foreach (var cartDetail in cartDetails)
							{
								if(cartDetail.ProductDetails.Quantity < cartDetail.Quantity)
								{
									message.Add(cartDetail.ProductDetails.Products.Name);
									check = false;
									continue;
								}

								decimal? discountedPrice = cartDetail.ProductDetails.SaleProducts
									.Where(sp => sp.EffectiveDate <= DateTime.Now && sp.ExpiryDate >= DateTime.Now)
									.OrderByDescending(sp => sp.EffectiveDate)
									.FirstOrDefault()?.DiscountedPrice;

								var finalPrice = discountedPrice.HasValue && discountedPrice.Value > 0
									? discountedPrice.Value
									: cartDetail.Price;

									await _dbcontext.BillDetails.AddAsync(new BillDetails()
									{
										Id = Guid.NewGuid(),
										Quantity = cartDetail.Quantity,
										Price = finalPrice,
										Status = cartDetail.Status,
										BillId = bill.Id,
										ProductDetailId = cartDetail.ProductDetailsId
									});


								var productDetails = cartDetail.ProductDetails;
								productDetails.Quantity -= cartDetail.Quantity;
								_dbcontext.ProductDetails.Update(productDetails);
							}

                            await _dbcontext.SaveChangesAsync();

							bill.Total = bill.BillDetails != null ? bill.BillDetails.Sum(bd => bd.Price) : 0;

							if (VoucherId != null && bill.Total != 0)
							{
								var voucher = await _dbcontext.Vouchers
									.Where(v => v.Id == VoucherId)
									.FirstOrDefaultAsync();

								if (voucher != null && voucher.Value > 0)
								{
									decimal discountPercentage = (decimal)voucher.Value;
									decimal discountAmount = (bill.Total * discountPercentage) / 100;
									bill.Total -= discountAmount;
								}
							}
							if(bill.Total != 0)
								bill.Total += ShippingFee;

							check = true;
						}
					}

                    // Save the changes
                    await _dbcontext.SaveChangesAsync();
                    await dbTransaction.CommitAsync();
                    Id = bill.Id;
                }
                catch (Exception ex)
                {
                    await dbTransaction.RollbackAsync();
                    Console.WriteLine(ex.Message);
                    return (false, Guid.Empty, ex.Message);
                }
            }
			if (check)
			{
				await _cartDetailServices.ClearCart((Guid)CartId);
				return (true, Id, string.Join(" , ", message));
			}
			else
				return (false, null, string.Join(" , ", message));
        }

		public async Task<(bool k, Guid billId)> UpdateBill(Guid billId, decimal newShippingFee)
		{
			bool isSuccess = false;
			Guid billIdResult = Guid.Empty;

			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = await _dbcontext.Bills
						.Include(b => b.BillDetails)
						.ThenInclude(bd => bd.ProductDetails)
						.ThenInclude(pd => pd.SaleProducts)
						.FirstOrDefaultAsync(b => b.Id == billId);

					if (bill == null)
					{
						return (false, Guid.Empty);
					}

					decimal oldShippingFee = bill.ShippingFee;
					bill.ShippingFee = newShippingFee;

					decimal productsTotal = bill.BillDetails?.Sum(bd =>
					{
						if (bd.ProductDetails == null || bd.ProductDetails.SaleProducts == null)
							return bd.Price;

						decimal? discountedPrice = bd.ProductDetails.SaleProducts
							.Where(sp => sp.EffectiveDate <= DateTime.Now && sp.ExpiryDate >= DateTime.Now)
							.OrderByDescending(sp => sp.EffectiveDate)
							.FirstOrDefault()?.DiscountedPrice;

						return discountedPrice.HasValue && discountedPrice.Value > 0
							? discountedPrice.Value
							: bd.Price;
					}) ?? 0;

					bill.Total = productsTotal + newShippingFee;

					await _dbcontext.SaveChangesAsync();
					await dbTransaction.CommitAsync();

					billIdResult = bill.Id;
					isSuccess = true;
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();
					Console.WriteLine($"Error in UpdateBill: {ex.Message}");
					return (false, Guid.Empty);
				}
			}
			return (k: isSuccess, billId: billIdResult);
		}
		public async Task<ReturnMessage> ChangeStatusTo(Guid BillId, int Status, string note, Guid UserWhoCreateThis)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = await _dbcontext.Bills
						.Include(b => b.BillDetails)
						.FirstOrDefaultAsync(b => b.Id == BillId);

					if (bill == null)
						return new ReturnMessage { status = 1, message = "Không tìm thấy hóa đơn" };

					// Validate chuyển trạng thái
					if (!ValidateStatusTransition(bill.BillType, bill.Status, (StatusType)Status))
						return new ReturnMessage { status = 1, message = "Không thể chuyển sang trạng thái này" };

					// Xử lý đặc biệt cho từng trạng thái
					switch ((StatusType)Status)
					{
						case StatusType.DangGiaoHang:
							bill.DeliveryDate = DateTime.Now;
							break;

						case StatusType.HoanThanh:
							if (bill.BillType == "POS" && bill.PaymentAmount < bill.Total)
								return new ReturnMessage { status = 1, message = "Chưa thanh toán đủ" };
							break;

						case StatusType.DaHuy:
							// Hoàn trả số lượng vào kho
							foreach (var detail in bill.BillDetails)
							{
								var product = await _dbcontext.ProductDetails
									.FirstOrDefaultAsync(p => p.Id == detail.ProductDetailId);
								if (product != null)
									product.Quantity += detail.Quantity;
							}
							break;
					}

					bill.Status = (StatusType)Status;

					// Lưu lịch sử trạng thái
					await _dbcontext.StatusHistories.AddAsync(new StatusHistory
					{
						Id = Guid.NewGuid(),
						CreatedDate = DateTime.Now,
						StatusType = (StatusType)Status,
						Note = note,
						WhoCreatedThis = UserWhoCreateThis,
						BillId = BillId
					});

					await _dbcontext.SaveChangesAsync();
					await dbTransaction.CommitAsync();

					return new ReturnMessage { status = 0, message = "Đã chuyển trạng thái thành công" };
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();
					return new ReturnMessage { status = 2, message = $"Lỗi: {ex.Message}" };
				}
			}
		}
		private static bool ValidateStatusTransition(string billType, StatusType currentStatus, StatusType newStatus)
		{
			// Kiểm tra logic chuyển trạng thái theo loại hóa đơn
			return billType switch
			{
				"POS" => ValidatePOSTransition(currentStatus, newStatus),
				"COD" => ValidateDeliveryTransition(billType, currentStatus, newStatus),
				"Online" => ValidateDeliveryTransition(billType, currentStatus, newStatus),
				_ => false
			};
		}
		private static bool ValidatePOSTransition(StatusType currentStatus, StatusType newStatus)
		{			
			return currentStatus switch
			{
				StatusType.TaoHoaDon when newStatus == StatusType.DaThanhToan => true,
				StatusType.DaThanhToan when newStatus == StatusType.HoanThanh => true,
				StatusType.TaoHoaDon when newStatus == StatusType.DaHuy => true,
				StatusType.TaoHoaDon when newStatus == StatusType.ChoXuLy => true,
				StatusType.ChoXuLy when newStatus == StatusType.DaThanhToan => true,
				_ => false
			};
		}

		private static bool ValidateDeliveryTransition(string billType, StatusType currentStatus, StatusType newStatus)
		{
			switch (billType)
			{
				case "COD":
					return currentStatus switch
					{
						StatusType.TaoHoaDon when newStatus == StatusType.ChoXuLy => true,
						StatusType.ChoXuLy when newStatus == StatusType.DangChuanBiHang => true,

						StatusType.ChoXuLy when newStatus == StatusType.ChoCoHang => true,
						StatusType.ChoCoHang when newStatus == StatusType.DangChuanBiHang => true,
						StatusType.ChoCoHang when newStatus == StatusType.DaHuy => true,
						StatusType.DangGiaoHang when newStatus == StatusType.DaHuy => true,

						StatusType.DangChuanBiHang when newStatus == StatusType.DangGiaoHang => true,
						StatusType.DangGiaoHang when newStatus == StatusType.DaGiaoToi => true,
						StatusType.DaGiaoToi when newStatus == StatusType.DaThanhToan => true,
						StatusType.DaThanhToan when newStatus == StatusType.HoanThanh => true,
						_ => false
					};

				case "Online":
					return currentStatus switch
					{
						StatusType.TaoHoaDon when newStatus == StatusType.DaThanhToan => true,
						StatusType.DaThanhToan when newStatus == StatusType.ChoXuLy => true,

						StatusType.ChoXuLy when newStatus == StatusType.ChoCoHang => true,
						StatusType.ChoCoHang when newStatus == StatusType.DangChuanBiHang => true,
						StatusType.ChoCoHang when newStatus == StatusType.DaHuy => true,
						StatusType.DangGiaoHang when newStatus == StatusType.DaHuy => true,

						StatusType.ChoXuLy when newStatus == StatusType.DangChuanBiHang => true,
						StatusType.DangChuanBiHang when newStatus == StatusType.DangGiaoHang => true,
						StatusType.DangGiaoHang when newStatus == StatusType.DaGiaoToi => true,
						StatusType.DaGiaoToi when newStatus == StatusType.HoanThanh => true,
						_ => false
					};

				default:
					return false;
			}
		}
		public async Task<ReturnMessage> Delete(Guid Id)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = await _dbcontext.Bills.Where(c => c.Id == Id).FirstOrDefaultAsync();
					if (bill == null || bill.Status == StatusType.DaHuy)
						return new ReturnMessage()
						{
							status = 1,
							message = "Hoá đơn đã xoá hoặc đã huỷ"
						};

					var total = bill.PaymentAmount;

					var customer = bill.CustomerId == null ? null : _dbcontext.Customers.Find(bill.CustomerId);

					if (bill.Total > 0)
					{
						var billDetails = await _dbcontext.BillDetails.Where(bd => bd.BillId == Id).ToListAsync();
						if (billDetails != null)
						{
							var productDetails = await _dbcontext.ProductDetails.ToListAsync();
							var query = from bd in billDetails
										join pd in productDetails
										on bd.ProductDetailId equals pd.Id
										select pd;
							query.ToList().ForEach(product =>
							{
								product.Quantity += billDetails.FirstOrDefault(bd => bd.ProductDetailId == product.Id).Quantity;
							});

							_dbcontext.ProductDetails.UpdateRange(query);
						}

					}
					else _dbcontext.Bills.Remove(bill);

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();
					return new ReturnMessage()
					{
						status = 0,
						message = $"Huỷ hoá đơn thành công \n Số tiền cần hoàn trả là {total}VND",
						data = customer == null ? null : $"{customer.Id} - {customer.Name} - {total}"
					};

				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã có lỗi xảy ra : {ex.Message}"
					};
				}
			}
		}
		public async Task<ReturnMessage> Refund(Guid Id, Guid CustomerWhoDoThis, string? note)
		{
			using (var dbtransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = await _dbcontext.Bills.Where(c => c.Id == Id).FirstOrDefaultAsync();
					if (bill == null || bill.Status == StatusType.DaHuy || bill.Status == StatusType.HoanTra)
						return new ReturnMessage()
						{
							status = 1,
							message = "Hoá đơn đã bị xoá, đã bị huỷ hoặc đang trong quá trình hoàn trả"
						};

					var customer = _dbcontext.Customers.Find(bill.CustomerId);

					bill.Status = StatusType.HoanTra;

					StatusHistory statusHistory = new StatusHistory()
					{
						Id = Guid.NewGuid(),
						CreatedDate = DateTime.Now,
						StatusType = StatusType.HoanTra,
						Note = note,
						WhoCreatedThis = CustomerWhoDoThis,
						BillId = Id
					};

					_dbcontext.Bills.Update(bill);
					await _dbcontext.StatusHistories.AddAsync(statusHistory);

					await _dbcontext.SaveChangesAsync();

					await dbtransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = "Đã yêu cầu hoàn trả!\nQuý khách vui lòng chờ nhân viên xác nhận qua số điện thoại hoặc email!"
					};
				}
				catch (Exception ex)
				{
					await dbtransaction.RollbackAsync();
					return new ReturnMessage()
					{
						status = 2,
						message = "Đã có lỗi xảy ra khi gửi yêu cầu hoàn trả : " + ex.Message
					};
				};
			}
		}


		//Shipping Address
		public async Task<ReturnMessage> AddAddressToBill(ShippingAddressInfoModel model)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = _dbcontext.Bills.FirstOrDefaultAsync(b => b.Id == model.BillId).Result;
					if (bill == null) return new ReturnMessage()
					{
						status = 4,
						message = "Không tìm thấy hoá đơn"
					};

					if ((int)bill.Status >= 3 && (int)bill.Status <= 5) return new ReturnMessage()
					{
						status = 1,
						message = "Đơn hàng đang trong quá trình vận chuyển hoặc đã vận chuyển nên không thể đổi địa chỉ"
					};

					await _dbcontext.ShippingAddresses.AddAsync(new ShippingAddress()
					{
						Id = Guid.NewGuid(),
						RecipientName = model.RecipientName,
						PhoneNumber = model.PhoneNumber,
						AddressDetail = model.AddressDetail,
						City = model.City,
						District = model.District,
						Ward = model.Ward,
						Status = model.Status,
						BillId = model.BillId
					});

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();
					return new ReturnMessage()
					{
						status = 0,
						message = "Đã thêm thành công địa chỉ giao hàng"
					};

				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã có lỗi xảy ra khi thêm địa chỉ : {ex.InnerException}"
					};
				}
			}
		}
		public async Task<ReturnMessage> DeleteAddress(Guid Id)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var shippingAdress = await _dbcontext.ShippingAddresses.Where(c => c.Id == Id).FirstOrDefaultAsync();

					if (shippingAdress != null) _dbcontext.ShippingAddresses.Remove(shippingAdress);

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = "Đã xoá thành công địa chỉ khỏi hoá đơn"
					};
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = "Đã có lỗi xảy ra khi xoá địa chỉ này"
					};
				}
			}
		}
		public async Task<ReturnMessage> EditAddress(Guid Id, ShippingAddressInfoModel model)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = _dbcontext.Bills.FirstOrDefaultAsync(b => b.Id == model.BillId).Result;
					if (bill == null) return new ReturnMessage()
					{
						status = 4,
						message = "Không tìm thấy hoá đơn"
					};

					if ((int)bill.Status >= 3 && (int)bill.Status <= 5) return new ReturnMessage()
					{
						status = 1,
						message = "Đơn hàng đang trong quá trình vận chuyển hoặc đã vận chuyển nên không thể đổi địa chỉ"
					};

					var shippingAddress = await _dbcontext.ShippingAddresses.Where(c => c.Id == Id).FirstOrDefaultAsync();

					shippingAddress.RecipientName = model.RecipientName;
					shippingAddress.PhoneNumber = model.PhoneNumber;
					shippingAddress.AddressDetail = model.AddressDetail;
					shippingAddress.City = model.City;
					shippingAddress.District = model.District;
					shippingAddress.Ward = model.Ward;
					shippingAddress.Status = model.Status;

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = "Sửa thành công địa chỉ giao hàng"
					};
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = "Đã có lỗi xảy ra khi sửa địa chỉ"
					};
				}
			}
		}


		//Payment History
		public async Task<ReturnMessage> Pay(decimal AmountInput, int PaymentMethod, int Status, Guid BillId)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var billDetails = await _dbcontext.BillDetails.Where(b => b.BillId == BillId).Include(bd => bd.ProductDetails).ToListAsync();
					var bill = _dbcontext.Bills.FirstOrDefault(b => b.Id == BillId);
					var billCode = bill.BillCode;


					if (bill.PaymentAmount == bill.Total && bill.PaymentAmount > 0)
						return new ReturnMessage()
						{
							status = 3,
							message = "Đơn hàng đã được thanh toán đủ"
						};

					if (bill.Status == StatusType.DaHuy)
						return new ReturnMessage()
						{
							status = 4,
							message = "Đơn hàng đã bị huỷ, không thể thanh toán"
						};

					await _dbcontext.PaymentHistories.AddAsync(new PaymentHistory()
					{
						Id = Guid.NewGuid(),
						CreatedDate = DateTime.Now,
						Amount = AmountInput,
						PaymentMethod = (PaymentMethods)PaymentMethod,
						Status = (StatusForPayment)Status,
						BillId = BillId
					});

					List<ProductDetails> productDetails = new List<ProductDetails>();
					for (int i = 0; i < billDetails.Count; i++)
					{
						ProductDetails productDetail = await _dbcontext.ProductDetails.FirstOrDefaultAsync(k => k.Id == billDetails[i].ProductDetailId);
						if (billDetails[i].Quantity > productDetail.Quantity)
							return new ReturnMessage()
							{
								status = 1,
								message = $"Số lượng sản phẩm {productDetail.Products.Name} trong kho không đủ cho đơn hàng"
							};
						productDetail.Quantity -= billDetails[i].Quantity;

						productDetails.Add(productDetail);
					}

					_dbcontext.ProductDetails.UpdateRange(productDetails);

					bill.PaymentDate = DateTime.Now;
					bill.PaymentAmount = AmountInput;

					_dbcontext.Bills.Update(bill);

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();
					return new ReturnMessage() { status = 0, message = $"Thanh toán thành công {AmountInput} VND cho đơn hàng {billCode}!" };

				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();
					return new ReturnMessage() { status = 2, message = $"Đã có lỗi xảy ra: {ex.Message}" };
				}
			}
		}

		public async Task<ReturnMessage> CancelPaymentById(Guid id, long billCode)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var payment = await _dbcontext.PaymentHistories.Where(c => c.Id == id).Include(ph => ph.Bill).FirstOrDefaultAsync();
					var bill = await _dbcontext.Bills.FindAsync(id);



					PayOS payOs = new PayOS(_clientId, _apiKey, _checkSum);
					var result = await payOs.cancelPaymentLink(billCode);

					bill.PaymentAmount -= result.amount;
					if (bill.PaymentAmount < 0) bill.PaymentAmount = 0;

					payment.Status = StatusForPayment.Cancelled;

					_dbcontext.PaymentHistories.Update(payment);
					_dbcontext.Bills.Update(bill);

					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();
					return new ReturnMessage()
					{
						status = 0,
						message = result.ToString()
					};

				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã có lỗi xảy ra trong quá trình xoá : {ex.Message}"
					};
				}
			}
		}

		// BillDetails
		public async Task<ReturnMessage> AddToBill(BillDetailInfoModel model)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var productDetail = await _dbcontext.ProductDetails.FindAsync(model.ProductDetailId);
					var saleProduct = await _dbcontext.SaleProducts.FirstOrDefaultAsync(sp => sp.ProductDetailId == model.ProductDetailId);
					var billDetail = await _dbcontext.BillDetails.FirstOrDefaultAsync(bd => bd.BillId == model.BillId && bd.ProductDetailId == model.ProductDetailId);

					if (billDetail == null)
					{
						billDetail = new BillDetails()
						{
							Id = Guid.NewGuid(),
							Quantity = model.Quantity,
							Price = 0,
							Status = model.Status,
							BillId = model.BillId,
							ProductDetailId = model.ProductDetailId
						};

						decimal unitPrice = saleProduct != null && saleProduct.DiscountedPrice.HasValue
						? saleProduct.DiscountedPrice.Value
						: productDetail.Price;
						billDetail.Price = billDetail.Quantity * unitPrice;
						productDetail.Quantity -= billDetail.Quantity;

						if (productDetail.Quantity < billDetail.Quantity)
							throw new Exception("Không đủ số lượng sản phẩm trong kho");


						await _dbcontext.BillDetails.AddAsync(billDetail);

					}
					else
					{
						billDetail.Quantity += model.Quantity;
						if (billDetail.Quantity >= productDetail.Quantity)
							billDetail.Quantity = productDetail.Quantity;

						var quantityToReduce = model.Quantity;
						if (productDetail.Quantity < quantityToReduce)
							throw new Exception("Không đủ số lượng sản phẩm trong kho");

						decimal unitPrice = saleProduct != null && saleProduct.DiscountedPrice.HasValue
						? saleProduct.DiscountedPrice.Value
						: productDetail.Price;
						billDetail.Price = billDetail.Quantity *  unitPrice;
                        productDetail.Quantity -= billDetail.Quantity;

                        _dbcontext.BillDetails.Update(billDetail);
					}

					_dbcontext.ProductDetails.Update(productDetail);

					await _dbcontext.SaveChangesAsync();

					await UpdatePrice(model.BillId);

					await dbTransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = "Đã thêm vào hoá đơn thành công"
					};
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					Console.WriteLine(ex.Message);

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã xảy ra lỗi khi thêm vào hoá đơn : {ex.Message}"
					};
				}
			}
		}

		public async Task<ReturnMessage> AddQuantity(Guid Id, int Quantity)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var billDetail = await _dbcontext.BillDetails.FindAsync(Id);
					var productDetail = await _dbcontext.ProductDetails
						.Include(pd => pd.Products)
						.FirstOrDefaultAsync(pd => pd.Id == billDetail.ProductDetailId);

					if (billDetail == null) return new ReturnMessage()
					{
						status = 1,
						message = "Không tìm thấy sản phẩm này trong hoá đơn"
					};

					billDetail.Quantity += Quantity;

					if (billDetail.Quantity >= productDetail.Quantity)
						billDetail.Quantity = productDetail.Quantity;

					if (billDetail.Quantity <= 0) billDetail.Quantity = 0;

					billDetail.Price = billDetail.Quantity * productDetail.Price;

					productDetail.Quantity -= billDetail.Quantity;

					_dbcontext.BillDetails.Update(billDetail);
					_dbcontext.ProductDetails.Update(productDetail);

					await _dbcontext.SaveChangesAsync();

					await UpdatePrice(billDetail.BillId);

					await dbTransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = $"Đã thêm {Quantity} {productDetail.Products.Name} vào hoá đơn"
					};
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					Console.WriteLine(ex.Message);

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã xảy ra lỗi khi thêm sản phẩm vào hoá đơn : {ex.InnerException}"
					};
				}
			}
		}

		public async Task<ReturnMessage> ChangeQuantityFor(Guid Id, int Quantity)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var billDetail = await _dbcontext.BillDetails.FindAsync(Id);
					var productDetail = await _dbcontext.ProductDetails
						.Include(pd => pd.Products)
						.FirstOrDefaultAsync(pd => pd.Id == billDetail.ProductDetailId);

					if (billDetail == null) return new ReturnMessage()
					{
						status = 1,
						message = "Không tìm thấy sản phẩm cần đổi số lượng"
					};

					billDetail.Quantity = Quantity;

					if (billDetail.Quantity >= productDetail.Quantity)
						billDetail.Quantity = productDetail.Quantity;

					if (billDetail.Quantity <= 0) billDetail.Quantity = 0;

					billDetail.Price = billDetail.Quantity * productDetail.Price;

					_dbcontext.BillDetails.Update(billDetail);

					await _dbcontext.SaveChangesAsync();

					await UpdatePrice(billDetail.BillId);

					await dbTransaction.CommitAsync();

					return new ReturnMessage()
					{
						status = 0,
						message = $"Đã đổi số lượng sản phẩm của {productDetail.Products.Name} trong hoá đơn thành {Quantity}"
					};
				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					Console.WriteLine(ex.Message);

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã xảy ra lỗi khi đổi số lượng sản phẩm : {ex.InnerException}"
					};
				}
			}

		}

		// Momo API
		public async Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(Guid id, string description)
		{
			var bill = _dbcontext.Bills.FirstOrDefaultAsync(b => b.Id == id).Result;
			if (bill.Total - bill.PaymentAmount <= 0) return new MomoCreatePaymentResponseModel() { };

			var orderInfo = "Nội dung: " + description;
			var requestId = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
			var rawData =
				$"partnerCode=MOMO" +
				$"&accessKey=F8BBA842ECF85" +
				$"&requestId={requestId}" +
				$"&amount={(long)(bill.Total - bill.PaymentAmount)}" +
				$"&orderId={id}" +
				$"&orderInfo={orderInfo}" +
				$"&returnUrl=https://localhost:7172/api/Bills/Momo/CallBack/" +
				$"&notifyUrl=https://localhost:7172/api/Bills/Momo/Notify" +
				$"&extraData=";

			var signature = ComputeHmacSha256(rawData, "K951B6PE1waDMi640xX08PD3vg6EkVlz");

			var client = new RestClient("https://test-payment.momo.vn/gw_payment/transactionProcessor");
			var request = new RestRequest() { Method = Method.Post };
			request.AddHeader("Content-Type", "application/json; charset=UTF-8");

			// Create an object representing the request data
			var requestData = new
			{
				accessKey = "F8BBA842ECF85",
				partnerCode = "MOMO",
				requestType = "captureMoMoWallet",
				notifyUrl = "https://localhost:7172/api/Bills/Momo/Notify",
				returnUrl = $"https://localhost:7172/api/Bills/Momo/CallBack/",
				orderId = id.ToString(),
				amount = ((long)(bill.Total - bill.PaymentAmount)).ToString(),
				orderInfo = orderInfo,
				requestId = requestId,
				extraData = "",
				signature = signature
			};

			request.AddParameter("application/json", JsonConvert.SerializeObject(requestData), ParameterType.RequestBody);

			var response = await client.ExecuteAsync(request);
			Console.WriteLine(response.Content);
			var momoResponse = JsonConvert.DeserializeObject<MomoCreatePaymentResponseModel>(response.Content);
			return momoResponse;

		}
		public async Task<MomoExecuteResponseModel> PaymentExecuteAsync(IQueryCollection collection)
		{
			var amount = collection.First(s => s.Key == "amount").Value;
			var orderInfo = collection.First(s => s.Key == "orderInfo").Value;
			var orderId = collection.First(s => s.Key == "orderId").Value;

			return new MomoExecuteResponseModel()
			{
				Amount = long.Parse(amount),
				OrderId = orderId,
				OrderInfo = orderInfo

			};
		}
		private string ComputeHmacSha256(string message, string secretKey)
		{
			var keyBytes = Encoding.UTF8.GetBytes(secretKey);
			var messageBytes = Encoding.UTF8.GetBytes(message);

			byte[] hashBytes;

			using (var hmac = new HMACSHA256(keyBytes))
			{
				hashBytes = hmac.ComputeHash(messageBytes);
			}

			var hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

			return hashString;
		}

		//PayOS API
		public async Task<CreatePaymentResult> CreatePayOSRequestAsync(Guid id, string description)
		{
			var cancelUrl = $"https://localhost:7172/api/Bills/PayOS/CancelPayOS/{id}";

			PayOS payment = new(_clientId, _apiKey, _checkSum);
			var list = new List<ItemData>();
			var listProduct = await _dbcontext.BillDetails.Where(bd => bd.BillId == id)
				.Include(bd => bd.ProductDetails)
				.ThenInclude(pd => pd.Products)
				.ToListAsync();
			var bill = await _dbcontext.Bills.FindAsync(id);

			if (listProduct == null)
			{
				list.Add(new ItemData(null, 1, 0));
			}
			else
			{
				foreach (var item in listProduct)
				{
					list.Add(new ItemData(item.ProductDetails.Products.Name, item.Quantity, (int)item.Price));
				};
			}

			var returnUrl = $"https://localhost:7172/api/Bills/PayOS/ReturnPayOS/{id}/{bill.CustomerId}";
			// var returnURLForAdmin = $"https://localhost:7172/api/Bills/PayOS/ReturnPayOSOffline/{id}/{bill.StaffId}";
            // var paymentRequestOs = new PaymentData(DateTimeOffset.Now.ToUnixTimeMilliseconds(),
			var returnURLForAdmin = $"https://localhost:7172/api/Bills/PayOS/ReturnPayOSOffline/{id}/{bill.StaffId}";
            var paymentRequestOs = new PaymentData(DateTimeOffset.Now.ToUnixTimeMilliseconds(),
				(int)(bill.Total - bill.PaymentAmount),
				description,
				list,
				cancelUrl,
				bill.CustomerId != null ? returnUrl : returnURLForAdmin
				// bill.CustomerId != null ? returnUrl : returnURLForAdmin
			);

			var paymentResult = await payment.createPaymentLink(paymentRequestOs);
			return paymentResult;
		}

		private async Task UpdatePrice(Guid BillId)
		{
			var bill = await _dbcontext.Bills
	.Include(b => b.BillDetails) // Nạp BillDetails cùng với Bill
	.FirstOrDefaultAsync(b => b.Id == BillId);

			bill.Total = bill.BillDetails == null ? 0 : bill.BillDetails.Sum(bd => bd.Price);
			if (bill.VoucherId != null)
			{
				var voucher = await _dbcontext.Vouchers.FindAsync(bill.VoucherId);
				bill.Total -= (bill.Total * (decimal)voucher.Value) / 100;
			}

			bill.Total += bill.ShippingFee;

			_dbcontext.Bills.Update(bill);
			await _dbcontext.SaveChangesAsync();
		}

		public async Task<List<ListBillDetailViewModel>> listBillDetails(Guid id)
		{
			try
			{
				var bill = await _dbcontext.BillDetails
					.Where(k => k.BillId == id)
					.ToListAsync();
				var details = await _dbcontext.ProductDetails
					.Include(k => k.Sizes)
					.Include(k => k.Colors)
					.ToListAsync();
				var images = await _dbcontext.Images.ToListAsync();
				var products = await _dbcontext.Products
					.Include(k => k.ProductDetails)
					.Include(k => k.Categories)
					.Include(k => k.Brands)
					.Include(k => k.Materials)
					.Include(k => k.TargretCustomers)
					.ToListAsync();

				var Data = new List<ListBillDetailViewModel>();
				foreach (var item in bill)
				{
					// Tìm Product dựa trên ProductDetailId
					var product = products.FirstOrDefault(p =>
						p.ProductDetails.Any(pd => pd.Id == item.ProductDetailId));

					// Tìm ProductDetail dựa trên ProductDetailId
					var detail = details.FirstOrDefault(k => k.Id == item.ProductDetailId);

					// Tìm ảnh liên quan
					var image = images.FirstOrDefault(k => k.ProductDetailId == item.ProductDetailId);

					// Tạo ViewModel
					var viewModel = new ListBillDetailViewModel
					{
						Id = item.Id,
						ImgUrl = image?.ImgUrl ?? product?.ImageUrl,
						Name = product?.Name,
						Size = detail?.Sizes.Name,
						Color = detail?.Colors.Name,
						Price = detail?.Price ?? 0,
						Quantity = item.Quantity,
						status = item.Status,
						ProductDetailId = item.ProductDetailId,
					};

					Data.Add(viewModel);
				}

				return Data;

			}
			catch (Exception ex)
			{

				throw new Exception("Đã có lỗi: " + ex.Message);
			}
		}

		public async Task<(bool k, string msg)> DeleteBillDetail(Guid Id)
		{
			try
			{
				var item = await _dbcontext.BillDetails.FindAsync(Id);
				if (item == null)
				{
					return (false, "Không tìm thấy sản phẩm cần xóa");
				}
				var bill = await _dbcontext.Bills.FirstOrDefaultAsync(k => k.Id == item.BillId);
				_dbcontext.Bills.Update(bill);
				_dbcontext.BillDetails.Remove(item);
				await _dbcontext.SaveChangesAsync();
				await UpdatePrice(bill.Id);
				return (true, "Xóa thành công");
			}
			catch (Exception ex)
			{
				return (false, ex.Message);
			}
		}


		public async Task<List<BillDto>> Filter(DateTime startDate, DateTime endDate)
		{
			var bills = await _dbcontext.Bills
				.Where(b => b.CreatedDate >= startDate && b.CreatedDate <= endDate)
				.Include(b => b.BillDetails)
				.Include(b => b.ShippingAddresses)
				.Include(b => b.StatusHistories)
				.Include(b => b.PaymentHistories)
				.Select(b => new BillDto
				{
					Id = b.Id,
					BillType = b.BillType,
					BillCode = b.BillCode,
					IsShipping = b.IsShipping,
					Total = b.Total,
					CreatedDate = b.CreatedDate,
					DeliveryDate = b.DeliveryDate,
					DateOfRecept = b.DateOfRecept,
					PaymentDate = b.PaymentDate,
					Status = b.Status.GetDisplayName(),
					PaymentAmount = b.PaymentAmount,
					ShippingFee = b.ShippingFee,
					ReasonForCancellation = b.ReasonForCancellation,

					CustomerId = b.CustomerId,
					VoucherId = b.VoucherId,
					StaffId = b.StaffId,

					// Ánh xạ bảng con
					BillDetails = b.BillDetails.Select(d => new BillDetailDto
					{
						Id = d.Id,
						BillId = d.BillId,
						ProductDetailId = d.ProductDetailId,
						Quantity = d.Quantity,
						Price = d.Price,
						Status = d.Status
					}).ToList(),

					ShippingAddresses = b.ShippingAddresses.Select(a => new ShippingAddressDto
					{
						Id = a.Id,
						BillId = a.BillId,
						RecipientName = a.RecipientName,
						AddressDetail = a.AddressDetail,
						PhoneNumber = a.PhoneNumber,
						City = a.City,
						District = a.District,
						Ward = a.Ward,
						Status = a.Status
					}).ToList(),

					PaymentHistories = b.PaymentHistories.Select(c => new PaymentHistoryDto
					{
						Id = c.Id,
						Amount = c.Amount,
						PaymentMethod = c.PaymentMethod.GetDisplayName(),
						Status = c.Status.GetDisplayName(),
						BillId = c.BillId
					}).ToList(),

					StatusHistories = b.StatusHistories.Select(c => new StatusHistoryDto
					{
						Id = c.Id,
						CreatedDate = c.CreatedDate,
						StatusType = c.StatusType.GetDisplayName(),
						Note = c.Note,
						WhoCreatedThis = c.WhoCreatedThis,
						BillId = c.BillId
					}).ToList()
				})
				.ToListAsync();
			return bills;
		}

		public async Task<(bool k, string msg)> ReturnProduct(RequestRefund request)
		{
			if (request == null || request.RefundItems == null || !request.RefundItems.Any())
			{
				return (false, "Vui lòng chọn sản phẩm cần hoàn trả");
			}

			request.Id = Guid.NewGuid();
			// Tính tổng số tiền hoàn tiền
			request.AmountRefund = request.RefundItems.Sum(item => item.Total);

			// Cập nhật trạng thái yêu cầu hoàn tiền
			request.Status = StatusTypeRq.ChoXuly; // Trạng thái ban đầu

			// Cập nhật thời gian tạo yêu cầu
			request.CreateTime = DateTime.UtcNow;

			foreach (var item in request.RefundItems)
			{
				item.Id = Guid.NewGuid();
			}

			// Tìm hóa đơn tương ứng và cập nhật trạng thái
			var bill = await _dbcontext.Bills.FindAsync(request.BillId);
			if (bill == null)
			{
				return (false, "Hóa đơn không tồn tại"); // Hóa đơn không tồn tại
			}

			// Cập nhật trạng thái hóa đơn
			bill.Status = StatusType.HoanTra; // Cập nhật trạng thái hóa đơn
			await _dbcontext.StatusHistories.AddAsync(new StatusHistory()
			{
				Id = Guid.NewGuid(),
				CreatedDate = DateTime.Now,
				StatusType = (StatusType)bill.Status,
				Note = "Trả hàng",
				WhoCreatedThis = request.requester,
				BillId = request.BillId
			});

			// Thêm yêu cầu hoàn tiền vào cơ sở dữ liệu
			_dbcontext.RequestRefunds.Add(request);

			// Lưu thay đổi vào cơ sở dữ liệu
			var result = await _dbcontext.SaveChangesAsync();

			// Kiểm tra xem việc lưu có thành công không
			if (result > 0)
			{
				return (true, "Tạo yêu cầu hoàn trả thành công"); // Trả về true và ID của yêu cầu hoàn tiền
			}

			return (false, "Tạo yêu cầu hoàn trả thất bại");
		}

		public async Task<bool> AcceptRefundRequest(Guid requestId, Guid staff)
		{
			// Lấy yêu cầu hoàn trả và các RefundItems
			var refundRequest = await _dbcontext.RequestRefunds
				.Include(r => r.RefundItems)
				.FirstOrDefaultAsync(r => r.Id == requestId);

			if (refundRequest == null)
			{
				throw new ArgumentException("Refund request not found.");
			}

			// Cập nhật trạng thái yêu cầu hoàn trả
			refundRequest.Status = StatusTypeRq.ChapNhan;

			// Cộng lại số lượng sản phẩm vào kho và trừ từ BillDetails
			foreach (var item in refundRequest.RefundItems)
			{
				// Tìm sản phẩm trong kho (giả sử bạn có một DbSet cho sản phẩm)
				var product = await _dbcontext.ProductDetails.FindAsync(item.ProductId);
				if (product != null)
				{
					product.Quantity += item.Quantity; // Cộng sản phẩm vào kho
				}

				// Trừ số lượng từ BillDetails
				var billDetail = await _dbcontext.BillDetails
					.FirstOrDefaultAsync(bd => bd.BillId == refundRequest.BillId && bd.ProductDetailId == item.Id);

				if (billDetail != null)
				{
					billDetail.Quantity -= item.Quantity; // Trừ số lượng hoàn trả
					if (billDetail.Quantity < 0)
					{
						throw new InvalidOperationException("Refund quantity exceeds the quantity in the bill.");
					}
				}
			}

			// Lưu lại trạng thái vào lịch sử
			var bill = await _dbcontext.Bills.FindAsync(refundRequest.BillId);
			await _dbcontext.StatusHistories.AddAsync(new StatusHistory()
			{
				Id = Guid.NewGuid(),
				CreatedDate = DateTime.Now,
				StatusType = (StatusType)bill.Status,
				Note = "Chấp nhận trả hàng",
				WhoCreatedThis = staff,
				BillId = refundRequest.BillId
			});

			// Lưu thay đổi vào cơ sở dữ liệu
			var result = await _dbcontext.SaveChangesAsync();

			return result > 0;
		}


		public async Task<bool> RejectRefundRequest(Guid requestId, Guid staff)
		{
			var refundRequest = await _dbcontext.RequestRefunds.FindAsync(requestId);
			if (refundRequest == null)
			{
				throw new ArgumentException("Refund request not found.");
			}

			// Cập nhật trạng thái yêu cầu hoàn trả
			refundRequest.Status = StatusTypeRq.TuChoi;

			// Tìm hóa đơn tương ứng và cập nhật trạng thái
			var bill = await _dbcontext.Bills.FindAsync(refundRequest.BillId);
			if (bill != null)
			{
				bill.Status = StatusType.HoanThanh; // Cập nhật trạng thái hóa đơn
			}

			await _dbcontext.StatusHistories.AddAsync(new StatusHistory()
			{
				Id = Guid.NewGuid(),
				CreatedDate = DateTime.Now,
				StatusType = (StatusType)bill.Status,
				Note = "Từ chối trả hàng",
				WhoCreatedThis = staff,
				BillId = refundRequest.BillId
			});

			// Lưu thay đổi vào cơ sở dữ liệu
			var result = await _dbcontext.SaveChangesAsync();

			return result > 0; // Trả về true nếu thành công
		}

		public async Task<List<RequestRefundDto>> ListRequest(Guid id)
		{
			var requestRefunds = await _dbcontext.RequestRefunds
			.Include(r => r.RefundItems) // Bao gồm RefundItems liên quan
			.Where(r => r.BillId == id) // Lọc theo BillId
			.ToListAsync();

			// Chuyển đổi RequestRefund sang RequestRefundDto
			var requestRefundDtos = requestRefunds.Select(r => new RequestRefundDto
			{
				Id = r.Id,
				requester = r.requester,
				BillId = r.BillId,
				CreateTime = r.CreateTime,
				Status = r.Status,
				AmountRefund = r.RefundItems?.Sum(i => i.Total) ?? 0, // Tính tổng AmountRefund
				RefundItems = r.RefundItems?.Select(i => new RefundItemDto
				{
					Id = i.Id,
					Name = i.Name,
					Quantity = i.Quantity,
					Price = i.Price,
					Total = i.Total,
					Note = i.Note,
					RequestId = i.RequestId
				}).ToList()
			}).ToList();

			return requestRefundDtos;
		}

		public async Task<ReturnMessage> PrevStatus(Guid BillId, int Status, string? note, Guid UserWhoCreateThis)
		{
			using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
			{
				try
				{
					var bill = await _dbcontext.Bills.FindAsync(BillId);
					bill.Status = (StatusType)Status;

					if (bill.Status == StatusType.DangGiaoHang) bill.DeliveryDate = DateTime.Now;
					if (bill.Status == StatusType.DaGiaoToi) bill.DeliveryDate = DateTime.Now;

					_dbcontext.Bills.Update(bill);

					await _dbcontext.StatusHistories.AddAsync(new StatusHistory()
					{
						Id = Guid.NewGuid(),
						CreatedDate = DateTime.Now,
						StatusType = (StatusType)Status,
						Note = note,
						WhoCreatedThis = UserWhoCreateThis,
						BillId = BillId
					});



					await _dbcontext.SaveChangesAsync();

					await dbTransaction.CommitAsync();
					return new ReturnMessage()
					{
						status = 0,
						message = "Đã chuyển trạng thái thành công"
					};

				}
				catch (Exception ex)
				{
					await dbTransaction.RollbackAsync();

					return new ReturnMessage()
					{
						status = 2,
						message = $"Đã có lỗi xảy ra : {ex.InnerException}"
					};
				}
			}
		}
	}

}

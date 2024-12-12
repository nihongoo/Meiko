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
					.Select(b => new BillDto
					{
						Id = b.Id,
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
					.Select(b => new BillDto
					{
						Id = b.Id,
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
        public async Task<(bool k, Guid id)> Create(bool IsShiping, decimal ShippingFee, Guid? StaffWhoCreateThis, Guid? CustomerWhoCreateThis, Guid? CartId, Guid? VoucherId, string billcode)
        {
            bool check = false;
            Guid billId = Guid.Empty;
            Guid Id;

            using (var dbTransaction = await _dbcontext.Database.BeginTransactionAsync())
            {
                try
                {
                    Bills bill = new Bills()
                    {
                        Id = Guid.NewGuid(),
                        BillCode = billcode,
                        IsShipping = IsShiping,
                        Total = 0,
                        CreatedDate = DateTime.Now,
                        Status = StatusType.TaoHoaDon,
                        PaymentAmount = 0,
                        ShippingFee = ShippingFee,
                        CustomerId = CustomerWhoCreateThis != null ? CustomerWhoCreateThis : null,
                        StaffId = StaffWhoCreateThis != null ? StaffWhoCreateThis : null,
                        VoucherId = VoucherId != null ? VoucherId : null,
                    };

                    await _dbcontext.Bills.AddAsync(bill);

                    billId = bill.Id;

                    if (CartId != null)
                    {
                        List<CartDetails>? cartDetails = await _dbcontext.CartDetails
                            .Where(cd => cd.CartId == CartId)
                            .Include(cd => cd.ProductDetails)
                            .ThenInclude(pd => pd.SaleProducts)
                            .ToListAsync();

                        if (cartDetails != null)
                        {
                            foreach (var cartDetail in cartDetails)
                            {
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
                            }
                        }

                        bill.Total = cartDetails.Sum(cd =>
                        {
                            decimal? discountedPrice = cd.ProductDetails.SaleProducts
                                .Where(sp => sp.EffectiveDate <= DateTime.Now && sp.ExpiryDate >= DateTime.Now)
                                .OrderByDescending(sp => sp.EffectiveDate)
                                .FirstOrDefault()?.DiscountedPrice;

                            var finalPrice = discountedPrice.HasValue && discountedPrice.Value > 0
                                ? discountedPrice.Value
                                : cd.Price;

                            return finalPrice * cd.Quantity;
                        }) + ShippingFee;

                        check = true;
                    }

                    await _dbcontext.SaveChangesAsync();
                    await dbTransaction.CommitAsync();
                    Id = bill.Id;
                }
                catch (Exception ex)
                {
                    await dbTransaction.RollbackAsync();
                    Console.WriteLine(ex.Message);
                    return (false, Guid.Empty);
                }
            }

            if (check == true) await _cartDetailServices.ClearCart((Guid)CartId);

            return (true, Id);
        }

        public async Task<ReturnMessage> ChangeStatusTo(Guid BillId, int Status, string? note, Guid UserWhoCreateThis)
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
					
					}else _dbcontext.Bills.Remove(bill);

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
					if (bill == null || bill.Status == StatusType.DaHuy ||  bill.Status == StatusType.HoanTra)
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
				catch(Exception ex)
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
		public async Task<ReturnMessage> Pay(decimal AmountInput, int PaymentMethod, int Status, Guid BillId, Guid? WhoDoThis)
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
					if (WhoDoThis == null)
						return new ReturnMessage()
						{
							status = 4,
							message = "Không tìm thấy người thực hiên hành dộng"
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

					await _dbcontext.StatusHistories.AddAsync(new StatusHistory()
					{
						Id = Guid.NewGuid(),
						CreatedDate = DateTime.Now,
						StatusType = StatusType.DaThanhToan,
						WhoCreatedThis = (Guid)WhoDoThis,
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
					bill.Status = StatusType.DaThanhToan;

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
                        billDetail.Price = billDetail.Quantity * unitPrice;

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

					_dbcontext.BillDetails.Update(billDetail);

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
			var returnUrl = $"https://localhost:7172/api/Bills/PayOS/ReturnPayOS/{id}";

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

			var paymentRequestOs = new PaymentData(DateTimeOffset.Now.ToUnixTimeMilliseconds(),
				(int)(bill.Total - bill.PaymentAmount),
				description,
				list,
				cancelUrl,
				returnUrl
			);

			var paymentResult = await payment.createPaymentLink(paymentRequestOs);
			return paymentResult;
		}

		//public static string GenerateSignature(decimal amount, string cancelUrl, string description, string orderCode, string returnUrl, string checksumKey)
		//{
		//	// Tạo chuỗi data theo định dạng được sắp xếp alphabet
		//	string data = $"amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}";

		//	// Chuyển checksumKey thành byte
		//	var keyBytes = Encoding.UTF8.GetBytes(checksumKey);

		//	// Tạo chữ ký HMAC_SHA256
		//	using (var hmac = new HMACSHA256(keyBytes))
		//	{
		//		var dataBytes = Encoding.UTF8.GetBytes(data);
		//		var hashBytes = hmac.ComputeHash(dataBytes);

		//		// Chuyển đổi hash thành chuỗi hex
		//		return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
		//	}
		//}

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
						status = item.Status
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
	}

}

using API.DTO;
using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class DataAnalysisService : IDataAnalysis
	{
		public readonly AppDbContext _dbcontext;
		public DataAnalysisService(AppDbContext appDbContext)
		{
			_dbcontext = appDbContext;
		}
		public async Task<DataAnalysisAllDTO> General()
		{
			// Lấy danh sách hóa đơn đã hoàn thành hoặc đã thanh toán
			var completedBills = await _dbcontext.Bills
				.Where(b => b.Status == StatusType.HoanThanh)
				.ToListAsync();

			// Tính tổng số lượng sản phẩm, doanh thu và lợi nhuận
			var totalQuantity = 0;
			decimal totalRevenue = 0;
			decimal totalProfit = 0;

			foreach (var bill in completedBills)
			{
				// Duyệt qua từng chi tiết hóa đơn
				var billDetails = await _dbcontext.BillDetails
					.Where(bd => bd.BillId == bill.Id)
					.Include(bd => bd.ProductDetails)
					.ToListAsync();

				foreach (var detail in billDetails)
				{
					// Doanh thu = Giá bán * Số lượng
					var revenue = detail.Price * detail.Quantity;
					totalRevenue += revenue;

					// Giá nhập = Giá nhập * Số lượng
					var importCost = detail.ProductDetails.ImportPrice * detail.Quantity;

					// Lợi nhuận = Doanh thu - Giá nhập
					var profit = revenue - importCost;
					totalProfit += profit;

					// Tổng số lượng sản phẩm
					totalQuantity += detail.Quantity;
				}
			}

			// Trả về DTO
			return new DataAnalysisAllDTO
			{
				AllQuantityProduct = totalQuantity,
				TotalRevenue = totalRevenue,
				Profit = totalProfit
			};
		}


		public async Task<List<TopCustomerDto>> TopCustomer()
		{
			// Lấy dữ liệu hóa đơn đã hoàn thành hoặc đã thanh toán
			var completedBills = await _dbcontext.Bills
				.Where(b => b.Status == StatusType.HoanThanh)
				.ToListAsync();

			// Nhóm theo khách hàng và tính tổng số tiền
			var topCustomers = completedBills
				.Where(b => b.CustomerId.HasValue) // Chỉ lấy các hóa đơn có khách hàng
				.GroupBy(b => b.CustomerId)
				.Select(group => new TopCustomerDto
				{
					CustomerId = group.Key,
					AmountSpent = group.Sum(b => b.Total) // Tổng tiền chi tiêu
				})
				.OrderByDescending(c => c.AmountSpent) // Sắp xếp giảm dần
				.Take(5) // Lấy 5 khách hàng đầu tiên
				.ToList();

			// Lấy thêm thông tin khách hàng nếu cần
			var customerDetails = await _dbcontext.Customers
				.Where(c => topCustomers.Select(tc => tc.CustomerId).Contains(c.Id))
				.ToListAsync();

			// Gắn thông tin chi tiết khách hàng vào DTO
			topCustomers.ForEach(tc =>
			{
				var customer = customerDetails.FirstOrDefault(c => c.Id == tc.CustomerId);
				if (customer != null)
				{
					tc.Name = customer.Name;
					tc.PhoneNumber = customer.PhoneNumber;
				}
			});

			return topCustomers;
		}


		public async Task<List<TopProductForDayDto>> TopProduct(DateTime? date = null)
		{
			var query = _dbcontext.BillDetails
				.Join(_dbcontext.Bills,
					  bd => bd.BillId,
					  b => b.Id,
					  (bd, b) => new { BillDetail = bd, Bill = b })
				.Where(x => x.Bill.Status == StatusType.HoanThanh);

			// Lọc theo ngày nếu có
			if (date.HasValue)
			{
				query = query.Where(x => x.Bill.CreatedDate.Date == date.Value.Date);
			}

			// Nhóm theo ProductDetailId và tính toán
			var result = await query
				.GroupBy(x => x.BillDetail.ProductDetailId)
				.Select(group => new
				{
					ProductDetailId = group.Key,
					Sold = group.Sum(x => x.BillDetail.Quantity),
					Revenue = group.Sum(x => x.BillDetail.Quantity * x.BillDetail.Price)
				})
				.OrderByDescending(x => x.Sold)
				.Take(10) // Lấy top 10 sản phẩm bán chạy
				.ToListAsync();

			// Lấy thông tin chi tiết sản phẩm
			var productDetails = await _dbcontext.ProductDetails
				.Where(pd => result.Select(r => r.ProductDetailId).Contains(pd.Id))
				.Include(pd => pd.Products)
				.Include(pd => pd.Colors)
				.Include(pd => pd.Sizes)
				.ToListAsync();

			// Gắn thông tin chi tiết vào DTO
			var topProducts = result.Select(r =>
			{
				var productDetail = productDetails.FirstOrDefault(pd => pd.Id == r.ProductDetailId);
				return new TopProductForDayDto
				{
					Date = date,
					Name = productDetail?.Products?.Name,
					Color = productDetail?.Colors?.Name,
					Size = productDetail?.Sizes?.Name,
					Sold = r.Sold,
					Revenue = r.Revenue
				};
			}).ToList();

			return topProducts;
		}


		public Task<List<TopProductForDayDto>> TopProductForDay(DateTime Day)
		{
			throw new NotImplementedException();
		}
	}
}

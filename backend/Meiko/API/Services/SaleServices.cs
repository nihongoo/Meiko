using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class SaleServices : ISaleServices
    {
        private readonly AppDbContext _appDbContext;
        public SaleServices(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task AddSalesAsync(Sales sales)
        {
            await _appDbContext.Sales .AddAsync(sales);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteSalesAsync(Guid id)
        {
            var sales = await _appDbContext.Sales.Include(s => s.SaleProducts)
                                         .FirstOrDefaultAsync(s => s.Id == id);
            if (sales != null)
            {
                _appDbContext.SaleProducts.RemoveRange(sales.SaleProducts);
                _appDbContext.Sales.Remove(sales);
                await _appDbContext.SaveChangesAsync();
            }
        }

        public async Task<List<Sales>> GetAllSalesAsync()
        {
            return await _appDbContext.Sales.Include(s => s.SaleProducts).ThenInclude(sp => sp.Productdetail).ToListAsync();
        }

        public async Task<Sales> GetSalesByIdAsync(Guid id)
        {
            return await _appDbContext.Sales.Include(s => s.SaleProducts).ThenInclude(sp => sp.Productdetail).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task UpdateSalesAsync(Sales sales)
        {
            _appDbContext.Sales.Update(sales);
            await _appDbContext.SaveChangesAsync();
        }

		public async Task<List<Sales>> Filter(DateTime startDate, DateTime endDate)
		{
			return await _appDbContext.Sales.Where(v => v.StartDay >= startDate && v.EndDay <= endDate).ToListAsync();
		}
	}
}

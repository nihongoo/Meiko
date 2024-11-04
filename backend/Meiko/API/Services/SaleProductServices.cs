using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class SaleProductServices : ISaleProductServices
    {
        private readonly AppDbContext _appDbContext;
        public SaleProductServices(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<SaleProducts>> GetAllSalesProductsAsync()
        {
            return await _appDbContext.SaleProducts
            .Include(sp => sp.Productdetail)
            .Include(sp => sp.sales)
            .ToListAsync();
        }
    }
}

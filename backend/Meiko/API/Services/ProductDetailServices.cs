using API.DTO;
using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class ProductDetailServices : IProductDetailServices
    {
        private readonly AppDbContext _context;

        public ProductDetailServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDetails>> GetAllAsync()
        {
            return await _context.ProductDetails
                .Include(pd => pd.Colors)
                .Include(pd => pd.Sizes)
                .Include(pd => pd.SaleProducts)
                .Include(pd => pd.Images)
                .ToListAsync();
        }

        public async Task<ProductDetails> GetByIdAsync(Guid id)
        {
            return await _context.ProductDetails
                .Include(pd => pd.Colors)
                .Include(pd => pd.Sizes)
                .Include(pd => pd.SaleProducts)
                .Include(pd => pd.Images)
                .FirstOrDefaultAsync(pd => pd.Id == id);
        }

        public async Task CreateAsync(ProductDetailViewModel model)
        {
            var productDetail = new ProductDetails
            {
                Id = Guid.NewGuid(),
                ProductDetailCode = model.ProductDetailCode,
                Quantity = model.Quantity,
                Weight = model.Weight,
                ImportPrice = model.ImportPrice,
                Price = model.Price,
                CreatTime = model.CreatTime,
                Status = model.Status,
                ProductId = model.ProductId,
                ColorId = model.ColorId,
                SizeId = model.SizeId
            };

            _context.ProductDetails.Add(productDetail);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductDetailDto model)
        {
            var productDetail = await _context.ProductDetails.FindAsync(model.Id);
            if (productDetail == null) throw new Exception("ProductDetail not found");

            productDetail.Quantity = model.Quantity;
            productDetail.Weight = model.Weight;
            productDetail.ImportPrice = model.ImportPrice;
            productDetail.Price = model.Price;
            productDetail.Status = model.Status;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var productDetail = await _context.ProductDetails.FindAsync(id);
            if (productDetail == null) throw new Exception("ProductDetail not found");

            _context.ProductDetails.Remove(productDetail);
            await _context.SaveChangesAsync();
        }

		public async Task<List<ProductDetails>> GetDetailsAsync(Guid id)
		{
            try
            {
                var result = await _context.ProductDetails
                    .Where(k=>k.ProductId == id)
                    .Include(k=>k.Products)
                    .Include(k=>k.Colors)
                    .Include(k=>k.Sizes)
                    .ToListAsync();
                return result;
            }
			catch (Exception ex)
			{
				throw new Exception("Đã có lỗi: " + ex.Message);
			}
		}
	}
}

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
                .Include(pd => pd.Products)
                .Include(pd => pd.Colors)
                .Include(pd => pd.Sizes)
                .Include(pd => pd.Sales)
                .ToListAsync();
        }

        public async Task<ProductDetails> GetByIdAsync(Guid id)
        {
            return await _context.ProductDetails
                .Include(pd => pd.Products)
                .Include(pd => pd.Colors)
                .Include(pd => pd.Sizes)
                .Include(pd => pd.Sales)
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
                SaleId = model.SaleId,
                SizeId = model.SizeId
            };

            _context.ProductDetails.Add(productDetail);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductDetailViewModel model)
        {
            var productDetail = await _context.ProductDetails.FindAsync(model.Id);
            if (productDetail == null) throw new Exception("ProductDetail not found");

            productDetail.ProductDetailCode = model.ProductDetailCode;
            productDetail.Quantity = model.Quantity;
            productDetail.Weight = model.Weight;
            productDetail.ImportPrice = model.ImportPrice;
            productDetail.Price = model.Price;
            productDetail.CreatTime = model.CreatTime;
            productDetail.Status = model.Status;
            productDetail.ProductId = model.ProductId;
            productDetail.ColorId = model.ColorId;
            productDetail.SaleId = model.SaleId;
            productDetail.SizeId = model.SizeId;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var productDetail = await _context.ProductDetails.FindAsync(id);
            if (productDetail == null) throw new Exception("ProductDetail not found");

            _context.ProductDetails.Remove(productDetail);
            await _context.SaveChangesAsync();
        }
    }
}

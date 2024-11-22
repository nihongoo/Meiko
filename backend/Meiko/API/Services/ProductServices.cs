using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class ProductServices : IProductServices
    {
        private readonly AppDbContext _context;

        public ProductServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Products>> GetAllAsync()
        {
            return await _context.Products
                                 .Include(p => p.Materials)
                                 .Include(p => p.Brands)
                                 .Include(p => p.Categories)
                                 .Include(p => p.TargretCustomers)
                                 .Include(p => p.ProductDetails).ThenInclude(p => p.Colors)
                                 .Include(p => p.ProductDetails).ThenInclude(p => p.SaleProducts).ThenInclude(p => p.sales)
                                 .Include(p => p.ProductDetails).ThenInclude(p => p.Images)
                                 .Include(p => p.FavoriteProducts)
                                 .ToListAsync();
        }

        public async Task<Products> GetByIdAsync(Guid id)
        {
            return await _context.Products.Include(p => p.Materials)
                                          .Include(p => p.Brands)
                                          .Include(p => p.Categories)
                                          .Include(p => p.TargretCustomers)
                                          .Include(p => p.ProductDetails).ThenInclude(p => p.Colors)
                                          .Include(p => p.ProductDetails).ThenInclude(p => p.SaleProducts).ThenInclude(p => p.sales)
                                          .Include(p => p.ProductDetails).ThenInclude(p => p.Images)
                                          .Include(p => p.FavoriteProducts)
                                          .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task CreateAsync(ProductViewModel model)
        {
            var product = new Products
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                Description = model.Description,
                ProductCode = model.ProductCode,
                ImageUrl = model.ImageUrl,
                WarrantyPeriod = model.WarrantyPeriod,
                CreateTime = model.CreateTime,
                Status = model.Status,
                MaterialId = model.MaterialId,
                BrandId = model.BrandId,
                CategoryId = model.CategoryId,
                TargretCustomerId = model.TargretCustomerId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, ProductViewModel model)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new Exception("Product not found");

            product.Name = model.Name;
            product.Description = model.Description;
            product.ProductCode = model.ProductCode;
            product.ImageUrl = model.ImageUrl;
            product.WarrantyPeriod = model.WarrantyPeriod;
            product.CreateTime = model.CreateTime;
            product.Status = model.Status;
            product.MaterialId = model.MaterialId;
            product.BrandId = model.BrandId;
            product.CategoryId = model.CategoryId;
            product.TargretCustomerId = model.TargretCustomerId;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new Exception("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}

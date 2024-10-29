using API.IServices;
using API.ViewModel;
using CloudinaryDotNet;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class ProductServices : IProductServices
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public ProductServices(AppDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        public async Task<IEnumerable<Products>> GetAllAsync()
        {
            return await _context.Products.Include(p => p.Materials)
                                          .Include(p => p.Brands)
                                          .Include(p => p.Categories)
                                          .Include(p => p.TargretCustomers)
                                          .ToListAsync();
        }

        public async Task<Products> GetByIdAsync(Guid id)
        {
            return await _context.Products.Include(p => p.Materials)
                                          .Include(p => p.Brands)
                                          .Include(p => p.Categories)
                                          .Include(p => p.TargretCustomers)
                                          .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task CreateAsync(ProductViewModel model)
        {
            var imgUrl = await GetAnImage(model.ImageUrl);

            var product = new Products
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                Description = model.Description,
                ProductCode = model.ProductCode,
                ImageUrl = imgUrl,
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

        public async Task UpdateAsync(ProductViewModel model)
        {
            var imgUrl = await GetAnImage(model.ImageUrl);

            var product = await _context.Products.FindAsync(model.Id);
            if (product == null) throw new Exception("Product not found");

            product.Name = model.Name;
            product.Description = model.Description;
            product.ProductCode = model.ProductCode;
            product.ImageUrl = imgUrl;
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

        public async Task<string> GetAnImage(string publicId)
        {
            string defaultUrl = "https://res.cloudinary.com/dtsqxauba/image/upload/v1730177470/default_image.png";
            var res = _cloudinary.GetResource(publicId);
            if(res.Url!=null) return res.Url;
            else return defaultUrl;
        }
    }
}

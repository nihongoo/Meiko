using API.IServices;
using API.ViewModel;
using CloudinaryDotNet;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;
using API.Extention;

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
            return await _context.Products.ToListAsync();
        }

        public async Task<Products> GetByIdAsync(Guid id)
        {
            return await _context.Products.Include(p => p.Materials)
                                          .Include(p => p.Brands)
                                          .Include(p => p.Categories)
                                          .Include(p => p.TargretCustomers)
                                          .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task CreateAsync(ProductViewModel model, List<ProductDetailViewModel> productDetails)
        {
            var imgUrl = await GetAnImage(model.ImageUrl);
            var genCode = Extention.Extention.GenerateSerialCode();
            model.ProductCode = genCode;

			var product = new Products
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                Description = model.Description,
                ProductCode = genCode,
                ImageUrl = imgUrl,
                WarrantyPeriod = model.WarrantyPeriod,
                CreateTime = DateTime.Now,
                Status = 1,
                MaterialId = model.MaterialId,
                BrandId = model.BrandId,
                CategoryId = model.CategoryId,
                TargretCustomerId = model.TargretCustomerId,
				ProductDetails = new List<ProductDetails>()
			};
            foreach (var details in productDetails)
            {
                var genCodeDetail = Extention.Extention.GenerateSerialCode();
                details.ProductDetailCode = genCodeDetail;

                product.ProductDetails.Add(new ProductDetails
                {
                    Id = Guid.NewGuid(),
                    ProductDetailCode = genCodeDetail,
                    Quantity = details.Quantity,
                    Weight = details.Weight,
                    ImportPrice = details.ImportPrice,
                    Price = details.Price,
                    CreatTime = DateTime.Now,
                    Status = 1,
                    ProductId = product.Id,
                    ColorId = details.ColorId,
                    SizeId = details.SizeId,
                });
            }

            await _context.Products.AddAsync(product);
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

		public async Task<string> GetAnImage(string publicId)
		{
			string defaultUrl = "https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png";
			var res = _cloudinary.GetResource(publicId);
			if (res.Url != null) return res.Url;
			else return defaultUrl;
		}

		public async Task<IEnumerable<Products>> GetAllInfo()
		{
            return await _context.Products.Include(p => p.Materials)
                                          .Include(p => p.Brands)
                                          .Include(p => p.Categories)
                                          .Include(p => p.TargretCustomers).
                                          ToListAsync();
		}
	}
}

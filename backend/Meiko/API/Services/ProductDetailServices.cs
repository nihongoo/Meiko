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

		public async Task<List<ProductDetails>> Search(string query)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(query))
				{
					return await _context.ProductDetails
						.Include(k => k.Products)
						.ToListAsync();
				}
				var result = await _context.ProductDetails
					.Include(k => k.Products)
					.Where(k => k.ProductDetailCode.Contains(query) ||
					k.Products.ProductCode.Contains(query))
					.ToListAsync();
				return result;
			}
			catch (Exception ex)
			{
				throw new Exception("Đã có lỗi: " + ex.Message);
			}
		}

		public async Task<List<SoldOffViewModel>> GetForSoldOff()
		{
			try
			{
				var detail = await _context.ProductDetails
					.Include(k => k.Sizes)
					.Include(k => k.Colors)
					.ToListAsync();

				var products = await _context.Products
					.Include(k => k.Categories)
					.Include(k => k.Brands)
					.Include(k => k.Materials)
					.Include(k => k.TargretCustomers)
					.ToListAsync();

				var images = await _context.Images.ToListAsync();

				var data = new List<SoldOffViewModel>();

				foreach (var detailItem in detail)
				{
					var image = images.FirstOrDefault(k => k.ProductDetailId == detailItem.Id);
					var product = products.FirstOrDefault(k => k.Id == detailItem.ProductId);

					var viewModel = new SoldOffViewModel
					{
						Id = detailItem.Id,
						ImgUrl = image?.ImgUrl ?? product?.ImageUrl,
						Name = product?.Name,
						Code = detailItem.ProductDetailCode,
						Category = product?.Categories?.Name,
						Brand = product?.Brands?.Name,
						Material = product?.Materials?.Name,
						Target = product?.TargretCustomers?.Name,
						Size = detailItem.Sizes?.Name,
						Color = detailItem.Colors?.Name,
						Price = detailItem.Price,
						Quantity = detailItem.Quantity
					};

					data.Add(viewModel);
				}

				return data;
			}
			catch (Exception ex)
			{
				throw new Exception("Đã có lỗi: " + ex.Message);
			}
		}

	}
}

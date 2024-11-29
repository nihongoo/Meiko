using API.IServices;
using API.ViewModel;
using CloudinaryDotNet;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class ImageServices : IImageServices
	{
		private readonly AppDbContext _dbContext;
		private readonly Cloudinary _cloudinary;
		public ImageServices(AppDbContext dbContext, Cloudinary cloudinary)
		{
			_dbContext = dbContext;
			_cloudinary = cloudinary;
		}

		public async Task<string> GetAnImage(string publicId)
		{
			string defaultUrl = "https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png";
			var res = _cloudinary.GetResource(publicId);
			if (res.Url != null) return res.Url;
			else return defaultUrl;
		}

		public async Task<string> AddImageToProductDetail(ImageViewModel image)
		{
			try
			{
				var imgUrl = await GetAnImage(image.PublicId);
				var item = new Images()
				{
					Id = Guid.NewGuid(),
					ImgUrl = imgUrl,
					PublicId = image.PublicId,
					ProductDetailId = image.ProductDetailId,
				};
				await _dbContext.AddAsync(item);
				await _dbContext.SaveChangesAsync();

				return "Thêm ảnh thành công";
			}
			catch (Exception ex)
			{
				return ex.Message;
			}

		}

		public async Task<IEnumerable<Images>> GetImagesAsync()
		{
			var images = await _dbContext.Images
				.Include(i => i.ProductDetails)
				.ToListAsync();
			return images;
		}

		public async Task<IEnumerable<Images>> GetImagesByPDId(Guid ProductDetailId)
		{
			var images = await _dbContext.Images
				.Where(i => i.ProductDetailId == ProductDetailId)
				.Include(i => i.ProductDetails)
				.ToListAsync();
			return images;
		}

		public async Task<string> RemoveImage(Guid id)
		{
			using (var dbTrans = await _dbContext.Database.BeginTransactionAsync())
			{
				try
				{
					var image = await _dbContext.Images.FindAsync(id);

					_dbContext.Images.Remove(image);
					await _dbContext.SaveChangesAsync();

					await dbTrans.CommitAsync();
					return "Xoá ảnh thành công!";
				}catch (Exception ex)
				{
					await dbTrans.RollbackAsync();
					return "Có lỗi xảy ra khi xoá ảnh! Lỗi : " + ex.Message;
				}
			}
		}

		public async Task<(bool k, string msg)> UpdateImage(ImageViewModel image)
		{
			try
			{
				var item = await _dbContext.Images.FirstOrDefaultAsync(k=>k.ProductDetailId == image.ProductDetailId);
				var newUrl = await GetAnImage(image.PublicId);
				item.PublicId = image.PublicId;
				item.ImgUrl = newUrl;

				await _dbContext.SaveChangesAsync();
				return (true,"Thay ảnh thành công");
			}
			catch (Exception ex)
			{
				return (false,ex.Message);
			}

		}
	}
}

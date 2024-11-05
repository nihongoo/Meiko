using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class ImageServices : IImageServices
	{
		private readonly AppDbContext _dbContext;
		public ImageServices(AppDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<string> AddImageToProductDetail(string ImgUrl, Guid ProductdDetailId)
		{
			using (var dbTrans = await _dbContext.Database.BeginTransactionAsync())
			{
				try
				{
					await _dbContext.Images.AddAsync(new Images()
					{
						Id = Guid.NewGuid(),
						ImgUrl = ImgUrl,
						ProductDetailId = ProductdDetailId
					});

					await _dbContext.SaveChangesAsync();
					await dbTrans.CommitAsync();
					return "Thêm ảnh thành công!";
				}
				catch (Exception ex)
				{
					await dbTrans.RollbackAsync();
					return "Có lỗi xảy ra khi thêm ảnh, Lỗi : " + ex.Message;
				}
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
	}
}

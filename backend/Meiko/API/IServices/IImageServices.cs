using DataProcessing.Models;

namespace API.IServices
{
	public interface IImageServices
	{
		public Task<IEnumerable<Images>> GetImagesAsync();
		public Task<IEnumerable<Images>> GetImagesByPDId(Guid ProductDetailId);
		public Task<string> AddImageToProductDetail(string ImgUrl, Guid ProductdDetailId);
		public Task<string> RemoveImage(Guid id);
	}
}

using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
	public interface IImageServices
	{
		public Task<IEnumerable<Images>> GetImagesAsync();
		public Task<IEnumerable<Images>> GetImagesByPDId(Guid ProductDetailId);
		public Task<string> AddImageToProductDetail(ImageViewModel image);
		public Task<(bool k, string msg)> UpdateImage(ImageViewModel image);
		public Task<string> RemoveImage(Guid id);
	}
}

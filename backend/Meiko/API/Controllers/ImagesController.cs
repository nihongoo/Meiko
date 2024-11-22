using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ImagesController : ControllerBase
	{
		private readonly IImageServices _imageServices;
        public ImagesController(IImageServices imageServices)
        {
            _imageServices = imageServices;
        }
        // GET: api/<ImagesController>
        [HttpGet]
		public async Task<IEnumerable<Images>> GetImagesAsync()
		{
			return await _imageServices.GetImagesAsync();
		}

		// GET api/<ImagesController>/5
		[HttpGet("{productdetailid}")]
		public async Task<IEnumerable<Images>> GetImagesByPDId(Guid productdetailid)
		{
			return await _imageServices.GetImagesByPDId(productdetailid);
		}

		// POST api/<ImagesController>
		[HttpPost]
		public async Task<string> AddImageToProductDetail(string imgurl, Guid productdetailid)
		{
			var response = await _imageServices.AddImageToProductDetail(imgurl, productdetailid);
			return response.ToString();
		}

		// DELETE api/<ImagesController>/5
		[HttpDelete("{id}")]
		public async Task<string> RemoveImage(Guid id)
		{
			return await _imageServices.RemoveImage(id);
		}
	}
}

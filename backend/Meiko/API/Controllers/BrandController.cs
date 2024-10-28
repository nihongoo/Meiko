using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandServices _brandServices;
        public BrandController(IBrandServices brandServices)
        {
            _brandServices = brandServices;
        }
        [HttpGet("get-all")]
        public async Task<List<Brands>> GetAll()
        {
            return await _brandServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<Brands> GetById(Guid id)
        {
            return await _brandServices.GetById(id);
        }
        [HttpPost("add-brand")]
        public async Task Create(Brands brands)
        {
            await _brandServices.Create(brands);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _brandServices.Delete(id);
        }
    }
}

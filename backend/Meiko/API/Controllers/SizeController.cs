using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizeController : ControllerBase
    {
        private readonly ISizeServices _sizeServices;
        public SizeController(ISizeServices sizeServices)
        {
            _sizeServices = sizeServices;
        }
        [HttpGet("get-all")]
        public async Task<List<Sizes>> GetAll()
        {
            return await _sizeServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<Sizes> GetById(Guid id)
        {
            return await _sizeServices.GetById(id);
        }
        [HttpPost("add-brand")]
        public async Task Create(Sizes sizes)
        {
            await _sizeServices.Create(sizes);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _sizeServices.Delete(id);
        }
    }
}

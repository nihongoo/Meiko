    using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : ControllerBase
    {
        private readonly IMaterialServices _materialServices;
        public MaterialController(IMaterialServices materialServices)
        {
            _materialServices = materialServices;
        }
        [HttpGet("get-all")]
        public async Task<List<Materials>> GetAll()
        {
            return await _materialServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<Materials> GetById(Guid id)
        {
           return await _materialServices.GetById(id);
        }
        [HttpPost("add-material")]
        public async Task Create(Materials materials)
        {
            await _materialServices.Create(materials);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _materialServices.Delete(id);
        }
    }
}

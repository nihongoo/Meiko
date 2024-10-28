using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController : ControllerBase
    {
        private readonly IColorServices _colorServices;
        public ColorController(IColorServices colorServices)
        {
            _colorServices = colorServices;
        }
        [HttpGet("get-all")]
        public async Task<List<Colors>> GetAll()
        {
            return await _colorServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<Colors> GetById(Guid id)
        {
            return await _colorServices.GetById(id);
        }
        [HttpPost("add-brand")]
        public async Task Create(Colors colors)
        {
            await _colorServices.Create(colors);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _colorServices.Delete(id);
        }
    }
}

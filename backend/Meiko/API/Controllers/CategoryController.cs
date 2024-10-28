using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryServices _categoryServices;
        public CategoryController(ICategoryServices categoryServices)
        {
            _categoryServices = categoryServices;
        }
        [HttpGet("Get-All")]
        public async Task<List<Categories>> GetAll()
        {
            return await _categoryServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<Categories> GetbyId(Guid id)
        {
            return await _categoryServices.GetById(id);
        }
        [HttpPost("add-category")]
        public async Task Create(Categories categories)
        {
            await _categoryServices.Create(categories);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _categoryServices.Delete(id);
        }
    }
}

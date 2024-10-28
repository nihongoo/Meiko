using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TargetController : ControllerBase
    {
        private readonly ITargetServices _targetServices;
        public TargetController(ITargetServices targetServices)
        {
            _targetServices = targetServices;
        }
        [HttpGet("get-all")]
        public async Task<List<TargretCustomers>> GetAll()
        {
            return await _targetServices.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<TargretCustomers> GetById(Guid id)
        {
            return await _targetServices.GetById(id);
        }
        [HttpPost("add-brand")]
        public async Task Create(TargretCustomers targretCustomers)
        {
            await _targetServices.Create(targretCustomers);
        }
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _targetServices.Delete(id);
        }
    }
}

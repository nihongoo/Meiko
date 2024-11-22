using API.IServices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleProductController : Controller
    {
        private readonly ISaleProductServices _services;
        public SaleProductController(ISaleProductServices saleProductServices)
        {
            _services = saleProductServices;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSalesProducts()
        {
            var saleProducts = await _services.GetAllSalesProductsAsync();
            return Ok(saleProducts);
        }
    }
}

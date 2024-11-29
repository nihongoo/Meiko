using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly ICustomerServices _services;
        private readonly AppDbContext _dbContext;
        public CustomerController(ICustomerServices customerServices, AppDbContext dbContext)
        {
            _services = customerServices;
            _dbContext = dbContext;
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _services.GetAllCustomersAsync();
            return Ok(customers);
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            var customer = await _services.GetCustomerByIdAsync(id);
            if (customer == null)
                return NotFound("Khách hàng không tồn tại.");

            return Ok(customer);
        }
        [HttpGet("{accountId}")]
        public async Task<ActionResult<Customers>> GetCustomerByAccountId(string accountId)
        {
            // Tìm khách hàng dựa trên AccountId
            var customer = await _dbContext.Customers
                                          .FirstOrDefaultAsync(c => c.ApplicationUserId == accountId);

            // Kiểm tra xem có tìm thấy khách hàng không
            if (customer == null)
            {
                return NotFound(new { message = "Khách hàng không tồn tại cho tài khoản này." });
            }

            // Trả về khách hàng tìm được
            return Ok(new { customerId = customer.Id, name = customer.Name, email = customer.Email });
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] Customers customers)
        {
            // Kiểm tra xem staff có ID khớp với ID trong URL không
            if (id != customers.Id)
            {
                return BadRequest("ID trong URL không khớp với ID trong đối tượng khách hàng.");
            }

            // Tìm kiếm nhân viên theo ID
            var existingStaff = await _services.GetCustomerByIdAsync(id);
            if (existingStaff == null)
            {
                return NotFound("Nhân viên không tồn tại.");
            }

            // Nếu nhân viên tồn tại, thực hiện cập nhật
            var result = await _services.UpdateCustomerAsync(customers);
            if (!result)
            {
                return BadRequest("Không thể cập nhật thông tin nhân viên.");
            }

            return NoContent();
        }

    }
}

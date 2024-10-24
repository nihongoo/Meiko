using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : Controller
    {
        private readonly IStaffServices _staffServices;
        public StaffController(IStaffServices staffServices)
        {
            _staffServices = staffServices;
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllStaffs()
        {
            var staffs = await _staffServices.GetAllStaffsAsync();
            return Ok(staffs);
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetStaffById(Guid id)
        {
            var staff = await _staffServices.GetStaffByIdAsync(id);
            if (staff == null)
                return NotFound("Nhân viên không tồn tại.");

            return Ok(staff);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateStaff(Guid id, [FromBody] Staffs staff)
        {
            if (id != staff.Id)
            {
                return BadRequest("ID trong URL không khớp với ID trong đối tượng nhân viên.");
            }

            var existingStaff = await _staffServices.GetStaffByIdAsync(id);
            if (existingStaff == null)
            {
                return NotFound("Nhân viên không tồn tại.");
            }

            var result = await _staffServices.UpdateStaffAsync(staff);
            if (!result)
            {
                return BadRequest("Không thể cập nhật thông tin nhân viên.");
            }
            return NoContent();
        }

    }
}

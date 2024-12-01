using API.Extention;
using API.IServices;
using API.Services;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class StaffController : Controller
	{
		private readonly IStaffServices _staffServices;
		private readonly ToolDB<Staffs> _tool;
		public StaffController(IStaffServices staffServices, ToolDB<Staffs> tool)
		{
			_staffServices = staffServices;
			_tool = tool;
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
		public async Task<IActionResult> UpdateStaff(Guid id, [FromBody] StaffViewModel staff)
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

		[HttpGet("Search")]
		public async Task<IActionResult> Search(string query, bool isStaffCode)
		{
			if (isStaffCode)
			{
				var result = await _tool.Search(query, "StaffCode");
				return Ok(result);
			}
			else
			{
				var result = await _tool.Search(query, "StaffName");
				return Ok(result);

			}
		}
	}
}

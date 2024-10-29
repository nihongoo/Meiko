using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class StaffServices : IStaffServices
    {
        private readonly AppDbContext _context;
        public StaffServices(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Staffs>> GetAllStaffsAsync()
        {
            return await _context.Staffs.ToListAsync();
        }

        public async Task<Staffs> GetStaffByIdAsync(Guid staffId)
        {
            return await _context.Staffs.FindAsync(staffId);
        }

        public async Task<bool> UpdateStaffAsync(Staffs staff)
        {
            var existingStaff = await _context.Staffs.FindAsync(staff.Id);
            if (existingStaff == null)
                return false;

            existingStaff.StaffCode = existingStaff.StaffCode;
            existingStaff.StaffName = staff.StaffName;
            existingStaff.Email = staff.Email;
            existingStaff.PhoneNumber = staff.PhoneNumber;
            existingStaff.Address = staff.Address;
            existingStaff.Status = existingStaff.Status;

            _context.Staffs.Update(existingStaff);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

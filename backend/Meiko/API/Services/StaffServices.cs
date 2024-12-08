using API.IServices;
using API.ViewModel;
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

		public async Task<Staffs> GetStaffByAccID(Guid id)
		{
            try
            {
                var item = await _context.Staffs.FirstOrDefaultAsync(k => k.ApplicationUserId == id.ToString());
                return item;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
		}

		public async Task<Staffs> GetStaffByIdAsync(Guid staffId)
        {
            return await _context.Staffs.FindAsync(staffId);
        }

        public async Task<bool> UpdateStaffAsync(StaffViewModel staff)
        {
            var existingStaff = await _context.Staffs.FindAsync(staff.Id);
            if (existingStaff == null)
                return false;

            existingStaff.StaffName = staff.StaffName;
            existingStaff.Email = staff.Email;
            existingStaff.PhoneNumber = staff.PhoneNumber;
            existingStaff.Address = staff.Address;
            existingStaff.Status = staff.Status;

            _context.Staffs.Update(existingStaff);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

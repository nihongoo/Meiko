using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IStaffServices
    {
        public Task<IEnumerable<Staffs>> GetAllStaffsAsync();
        public Task<Staffs> GetStaffByIdAsync(Guid staffId);
        public Task<bool> UpdateStaffAsync(StaffViewModel staff);
        public Task<Staffs> GetStaffByAccID(Guid id);
    }
}

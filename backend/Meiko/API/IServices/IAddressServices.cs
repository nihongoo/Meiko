using DataProcessing.Models;

namespace API.IServices
{
    public interface IAddressServices
    {
        public Task<IEnumerable<Address>> GetAddressesByCustomerIdAsync(Guid customerId);

        public Task<Address> GetAddressByIdAsync(Guid addressId);
        public Task<bool> CreateAddressAsync(Guid customerId, Address address);
        public Task<bool> UpdateAddressAsync(Guid addressId, Address address);
        public Task<bool> DeleteAddressAsync(Guid addressId);
    }
}

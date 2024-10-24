using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace API.Services
{
    public class AddressServices : IAddressServices
    {
        private readonly AppDbContext _context;
        public AddressServices(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }
        public async Task<bool> CreateAddressAsync(Guid customerId, Address address)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
            if (!customerExists)
            {
                throw new KeyNotFoundException($"Khách hàng với ID {customerId} không tồn tại.");
            }

            var validationResults = ValidateAddress(address);
            if (validationResults.Any())
            {
                var errorMessages = string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
                throw new ValidationException($"Xác thực địa chỉ không thành công: {errorMessages}");
            }

            address.CustomerId = customerId;
            address.Id = Guid.NewGuid();
            await _context.Address.AddAsync(address); 
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAddressAsync(Guid addressId)
        {
            var address = await _context.Address.FindAsync(addressId);
            if (address == null)
                return false;

            _context.Address.Remove(address);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Address> GetAddressByIdAsync(Guid addressId)
        {
            return await _context.Address.FindAsync(addressId);
        }

        public async Task<IEnumerable<Address>> GetAddressesByCustomerIdAsync(Guid customerId)
        {
            return await _context.Address.Where(a => a.CustomerId == customerId).ToListAsync();
        }

        public async Task<bool> UpdateAddressAsync(Guid addressId, Address address)
        {
            var existingAddress = await _context.Address.FindAsync(addressId);
            if (existingAddress == null)
            {
                throw new KeyNotFoundException($"Địa chỉ với ID {addressId} không tồn tại.");
            }

            var validationResults = ValidateAddress(address);
            if (validationResults.Any())
            {
                var errorMessages = string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
                throw new ValidationException($"Xác thực địa chỉ không thành công: {errorMessages}");
            }

            existingAddress.RecipientName = address.RecipientName;
            existingAddress.PhoneNumber = address.PhoneNumber;
            existingAddress.AddressDetail = address.AddressDetail;
            existingAddress.City = address.City;
            existingAddress.District = address.District;
            existingAddress.Ward = address.Ward;
            existingAddress.Status = address.Status;

            _context.Address.Update(existingAddress);
            return await _context.SaveChangesAsync() > 0;
        }

        private List<ValidationResult> ValidateAddress(Address address)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(address, serviceProvider: null, items: null);
            Validator.TryValidateObject(address, validationContext, validationResults, validateAllProperties: true);
            return validationResults;
        }
    }
}

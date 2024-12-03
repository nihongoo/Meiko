using API.IServices;
using API.ViewModel;
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

        public async Task<bool> CreateAddressAsync(Guid customerId, AddressViewModel addressViewModel)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
            if (!customerExists)
            {
                throw new KeyNotFoundException($"Khách hàng với ID {customerId} không tồn tại.");
            }

            var validationResults = ValidateAddressViewModel(addressViewModel);
            if (validationResults.Any())
            {
                var errorMessages = string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
                throw new ValidationException($"Xác thực địa chỉ không thành công: {errorMessages}");
            }

            var address = MapToAddress(addressViewModel);
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
            return await _context.Address
                                  .Include(a => a.Customers)
                                  .FirstOrDefaultAsync(a => a.Id == addressId);
        }

        public async Task<IEnumerable<Address>> GetAddressesByCustomerIdAsync(Guid customerId)
        {
            return await _context.Address
                                  .Where(a => a.CustomerId == customerId)
                                  .Include(a => a.Customers)
                                  .ToListAsync();
        }

        public async Task<bool> UpdateAddressAsync(Guid addressId, AddressViewModel addressViewModel)
        {
            var existingAddress = await _context.Address.FindAsync(addressId);
            if (existingAddress == null)
            {
                throw new KeyNotFoundException($"Địa chỉ với ID {addressId} không tồn tại.");
            }

            var validationResults = ValidateAddressViewModel(addressViewModel);
            if (validationResults.Any())
            {
                var errorMessages = string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
                throw new ValidationException($"Xác thực địa chỉ không thành công: {errorMessages}");
            }

            UpdateAddressFromViewModel(existingAddress, addressViewModel); 
            _context.Address.Update(existingAddress);
            return await _context.SaveChangesAsync() > 0;
        }

        private List<ValidationResult> ValidateAddressViewModel(AddressViewModel addressViewModel)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(addressViewModel, serviceProvider: null, items: null);
            Validator.TryValidateObject(addressViewModel, validationContext, validationResults, validateAllProperties: true);
            return validationResults;
        }

        private Address MapToAddress(AddressViewModel viewModel)
        {
            return new Address
            {
                RecipientName = viewModel.RecipientName,
                PhoneNumber = viewModel.PhoneNumber,
                Email = viewModel.Email,
                AddressDetail = viewModel.AddressDetail,
                City = viewModel.City,
                District = viewModel.District,
                Ward = viewModel.Ward,
                Status = viewModel.Status,
            };
        }

        private void UpdateAddressFromViewModel(Address address, AddressViewModel viewModel)
        {
            address.RecipientName = viewModel.RecipientName;
            address.PhoneNumber = viewModel.PhoneNumber;
            address.Email = viewModel.Email;
            address.AddressDetail = viewModel.AddressDetail;
            address.City = viewModel.City;
            address.District = viewModel.District;
            address.Ward = viewModel.Ward;
            address.Status = viewModel.Status;
        }
    }

}

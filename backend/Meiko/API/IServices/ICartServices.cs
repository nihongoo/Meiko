using DataProcessing.Models;

namespace API.IServices
{
	public interface ICartServices
	{
		Task<IEnumerable<Carts>> GetAllCartAsync();
		Task<Carts> GetCartByCustomerIdAsync(Guid CustomerId);
		Task<bool> CreateCartAsync(Guid CustomerId);
		Task<bool> DeleteCartAsync(Guid CustomerId);
		Task<bool> UpdateCartAsync(Guid CartId, int? Status);
	}
}

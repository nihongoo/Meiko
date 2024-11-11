using DataProcessing.Models;

namespace API.IServices
{
	public interface ICartDetailServices
	{
		public Task<IEnumerable<CartDetails>> GetCartDetailsAsync(); // Cho việc sửa lỗi là chính
		public Task<IEnumerable<CartDetails>> GetCDsByCartId(Guid CartId);
		public Task<Guid> GetCartIdByCDId(Guid cartDetailId); // Trả vể Id của giỏ hàng để cập nhật giá của giỏ hàng trong controller
		public Task<string> AddToCart(Guid CartId, Guid ProductDetailId, int Quantity); // Thêm sản phẩm đã tồn tại trong giỏ thì sẽ thay đổi số lượng
		public Task<bool> RemoveFromCart(Guid CartDetailId);
		public Task<string> ChangeStockOnly(Guid CartDetailId, Guid ProductDetailId, int Quantity); // Chỉ cập nhật số lượng sản phẩm trong giỏ hàng
		public Task<bool> ClearCart(Guid CartId); // Xoá toàn bộ sản phẩm trong giỏ hàng
	}
}

using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class CartDetailServices : ICartDetailServices
	{
		private readonly AppDbContext _appDbContext;
        public CartDetailServices(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<string> AddToCart(Guid CartId, Guid productDetailId, int Quantity)
		{
			using (var dbTrans = _appDbContext.Database.BeginTransaction())
			{
				try
				{
					var cartDetailEntity = await _appDbContext.CartDetails.Where(
						cd => cd.CartId == CartId
						&& cd.ProductDetailsId == productDetailId)
						.FirstOrDefaultAsync();

					var productDetail = _appDbContext.ProductDetails.Where(pd => pd.Id == productDetailId)
						.Include(p => p.Products)
						.FirstOrDefault();

					var text = $"Đã thêm {productDetail.Products.Name} vào giỏ hàng!";

					if (cartDetailEntity == null) _appDbContext.CartDetails.Add(new CartDetails()
					{
						Id = Guid.NewGuid(),
						Quantity = Quantity,
						Price = Quantity*productDetail.Price,
						Status = 5,
						CartId = CartId,
						ProductDetailsId = productDetailId
					});
					else
					{
						cartDetailEntity.Quantity += Quantity;

						if (cartDetailEntity.Quantity > productDetail.Quantity)
						{
							cartDetailEntity.Quantity = productDetail.Quantity;
							text = "Đã thêm số lượng sản phẩm tối đa còn lại trong kho!";
						}

						cartDetailEntity.Price = cartDetailEntity.Quantity * productDetail.Price;

						_appDbContext.CartDetails.Update(cartDetailEntity);
					}
					_appDbContext.SaveChanges();
					dbTrans.Commit();
					return text;
				}catch (Exception ex)
				{
					dbTrans.Rollback();
					return ex.Message;
				}
			}
		}

		public async Task<string> ChangeStockOnly(Guid CartDetailId, Guid ProductDetailId, int Quantity)
		{
			using (var dbTrans = _appDbContext.Database.BeginTransaction())
			{
				try
				{
					
					var cartDetail = await _appDbContext.CartDetails.Where(cd => cd.Id == CartDetailId)
						.Include(cd => cd.ProductDetails)
						.Include(cd => cd.Carts)
						.FirstOrDefaultAsync();
					var productDetail = await _appDbContext.ProductDetails.Where(pd => pd.Id == ProductDetailId)
						.Include(pd => pd.Products)
						.FirstOrDefaultAsync();

					var response = $"Đã thêm {Quantity} {productDetail.Products.Name} vào giỏ hàng!";

					if (cartDetail == null) response = "Sản phẩm này không tồn tại trong giỏ hàng";
					else
					{
						cartDetail.Quantity += Quantity;
						if (cartDetail.Quantity > cartDetail.ProductDetails.Quantity)
						{
							cartDetail.Quantity = cartDetail.ProductDetails.Quantity;
							response = "Đã thêm số lượng sản phẩm tối đa còn lại trong kho!";
						}
						cartDetail.Price = cartDetail.Quantity * productDetail.Price;

						_appDbContext.CartDetails.Update(cartDetail);
					}

					_appDbContext.SaveChanges();
					dbTrans.Commit();

					return response;
				}
				catch (Exception ex)
				{
					dbTrans.Rollback();
					return ex.Message;
				}
			}
		}

		public async Task<bool> ClearCart(Guid CartId)
		{
			using (var dbTrans = _appDbContext.Database.BeginTransaction())
			{
				try
				{
					var cartDetails = _appDbContext.CartDetails.Where(cd => cd.CartId == CartId).ToList();
					_appDbContext.CartDetails.RemoveRange(cartDetails);
					_appDbContext.SaveChanges();

					dbTrans.Commit();
					return true;
				}
				catch (Exception ex)
				{
					dbTrans.Rollback();
					return false;
				}
			}
		}

		public async Task<IEnumerable<CartDetails>> GetCartDetailsAsync()
		{
			return await _appDbContext.CartDetails
				.Include(cd => cd.Carts)
				.Include(cd => cd.ProductDetails)
					.ThenInclude(pd => pd.Products)
				.ToListAsync();
		}

		public async Task<Guid> GetCartIdByCDId(Guid cartDetailId)
		{
			var cartDetail = await _appDbContext.CartDetails.Where(cd => cd.Id == cartDetailId)
				.Include(cd => cd.Carts)
				.FirstOrDefaultAsync();
			return cartDetail.Carts.Id;
		}

		public async Task<IEnumerable<CartDetails>> GetCDsByCartId(Guid CartId)
		{
			return await _appDbContext.CartDetails
				.Where(cd => cd.CartId == CartId)
				.Include(cd => cd.Carts)
				.Include(cd => cd.ProductDetails)
					.ThenInclude(pd => pd.Products)
				.ToListAsync();
		}

		public async Task<bool> RemoveFromCart(Guid CartDetailId)
		{
			using (var dbTrans = _appDbContext.Database.BeginTransaction())
			{
				try
				{
					var cartDetail = await _appDbContext.CartDetails.FindAsync(CartDetailId);
					if (cartDetail == null) return false;

					_appDbContext.CartDetails.Remove(cartDetail);
					_appDbContext.SaveChanges();

					dbTrans.Commit();
					return true;
				}
				catch (Exception ex)
				{
					dbTrans.Rollback();
					return false;
				}
			}
		}
	}
}

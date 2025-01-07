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
            using (var dbTrans = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Lấy thông tin chi tiết giỏ hàng
                    var cartDetailEntity = await _appDbContext.CartDetails
                        .Where(cd => cd.CartId == CartId && cd.ProductDetailsId == productDetailId)
                        .FirstOrDefaultAsync();

                    // Lấy thông tin sản phẩm chi tiết
                    var productDetail = await _appDbContext.ProductDetails
                        .Where(pd => pd.Id == productDetailId)
                        .Include(p => p.Products)
                        .Include(p => p.SaleProducts)
                        .FirstOrDefaultAsync();

                    if (productDetail == null)
                    {
                        return "Sản phẩm không tồn tại!";
                    }

                    // Kiểm tra giảm giá (nếu có) và lấy giá sau giảm
                    decimal? discountedPrice = null;
                    if (productDetail.SaleProducts != null && productDetail.SaleProducts.Any())
                    {
                        discountedPrice = productDetail.SaleProducts
                            .Where(sp => sp.EffectiveDate <= DateTime.Now && (sp.ExpiryDate == null || sp.ExpiryDate >= DateTime.Now))
                            .Select(sp => sp.DiscountedPrice)
                            .FirstOrDefault();
                    }

                    // Nếu có giảm giá, dùng giá giảm; nếu không, dùng giá gốc
                    var finalPrice = discountedPrice.HasValue ? discountedPrice.Value : productDetail.Price;

                    // Tính tổng số lượng yêu cầu (đã có trong giỏ + số lượng mới thêm)
                    int totalQuantity = (cartDetailEntity?.Quantity ?? 0) + Quantity;

                    // Kiểm tra nếu tổng số lượng vượt quá tồn kho
                    if (totalQuantity > productDetail.Quantity)
                    {
                        return "Số lượng sản phẩm trong giỏ hàng vượt quá số lượng tồn kho!";
                    }

                    var response = $"Đã thêm {productDetail.Products.Name} vào giỏ hàng!";

                    if (cartDetailEntity == null)
                    {
                        // Thêm sản phẩm vào giỏ hàng nếu chưa có
                        await _appDbContext.CartDetails.AddAsync(new CartDetails()
                        {
                            Id = Guid.NewGuid(),
                            Quantity = Quantity,
                            Price = Quantity * finalPrice,
                            Status = 5,
                            CartId = CartId,
                            ProductDetailsId = productDetailId
                        });
                    }
                    else
                    {
                        cartDetailEntity.Quantity += Quantity;

                        cartDetailEntity.Price = cartDetailEntity.Quantity * finalPrice;

                        _appDbContext.CartDetails.Update(cartDetailEntity);
                    }

                    await _appDbContext.SaveChangesAsync();
                    await UpdateTotal(CartId);

                    await dbTrans.CommitAsync();
                    return response;
                }
                catch (Exception ex)
                {
                    await dbTrans.RollbackAsync();
                    return $"Lỗi: {ex.Message}";
                }
            }
        }

        public async Task<string> ChangeStockOnly(Guid CartDetailId, Guid ProductDetailId, int Quantity)
        {
            using (var dbTrans = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var cartDetail = await _appDbContext.CartDetails
                        .Where(cd => cd.Id == CartDetailId)
                        .Include(cd => cd.ProductDetails)
                        .Include(cd => cd.Carts)
                        .FirstOrDefaultAsync();

                    if (cartDetail == null)
                    {
                        return "Sản phẩm này không tồn tại trong giỏ hàng";
                    }

                    var productDetail = await _appDbContext.ProductDetails
                        .Where(pd => pd.Id == ProductDetailId)
                        .Include(pd => pd.Products)
                        .Include(pd => pd.SaleProducts)
                        .FirstOrDefaultAsync();

                    if (productDetail == null)
                    {
                        return "Sản phẩm chi tiết không tồn tại";
                    }

                    // Kiểm tra số lượng hợp lệ
                    if (Quantity <= 0)
                    {
                        return "Số lượng không hợp lệ";
                    }

                    var response = $"Đã thêm {Quantity} vào giỏ hàng!";

                    // Kiểm tra số lượng không vượt quá số lượng trong kho
                    cartDetail.Quantity = Quantity;
                    if (cartDetail.Quantity > cartDetail.ProductDetails.Quantity)
                    {
                        cartDetail.Quantity = cartDetail.ProductDetails.Quantity;
                        response = "Đã thêm số lượng sản phẩm tối đa còn lại trong kho!";
                    }

                    // Kiểm tra giảm giá sản phẩm (nếu có)
                    decimal? discountedPrice = productDetail.SaleProducts != null
                                                ? productDetail.SaleProducts
                                                .Where(sp => sp.EffectiveDate <= DateTime.Now && (sp.ExpiryDate == null || sp.ExpiryDate >= DateTime.Now))
                                                .Select(sp => sp.DiscountedPrice)
                                                .FirstOrDefault()
                                                : null;

                    // Nếu có giảm giá, sử dụng giá giảm, nếu không thì dùng giá gốc
                    var finalPrice = discountedPrice.HasValue ? discountedPrice.Value : productDetail.Price;

                    // Cập nhật giá trị của sản phẩm trong giỏ hàng
                    cartDetail.Price = cartDetail.Quantity * finalPrice;

                    // Cập nhật giỏ hàng
                    _appDbContext.CartDetails.Update(cartDetail);

                    // Lưu thay đổi và commit transaction
                    await _appDbContext.SaveChangesAsync();
                    await dbTrans.CommitAsync();

                    return response;
                }
                catch (Exception ex)
                {
                    await dbTrans.RollbackAsync();
                    return $"Lỗi: {ex.Message}";
                }
            }
        }


        public async Task<bool> ClearCart(Guid CartId)
		{
			using (var dbTrans = await _appDbContext.Database.BeginTransactionAsync())
			{
				try
				{
					var cartDetails = await _appDbContext.CartDetails
						.Where(cd => cd.CartId == CartId)
						.ToListAsync();
					_appDbContext.CartDetails.RemoveRange(cartDetails);
					await _appDbContext.SaveChangesAsync();

					await UpdateTotal(CartId);

					await dbTrans.CommitAsync();
					return true;
				}
				catch (Exception ex)
				{
					await dbTrans.RollbackAsync();
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
				.Include(cd => cd.ProductDetails).ThenInclude(pd => pd.SaleProducts)
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
					.ThenInclude(cd => cd.Products)
				.Include(cd => cd.ProductDetails).ThenInclude(cd => cd.Colors)
                .Include(cd => cd.ProductDetails).ThenInclude(cd => cd.Sizes)
                .Include(cd => cd.ProductDetails).ThenInclude(cd => cd.SaleProducts)
                .Include(cd => cd.ProductDetails).ThenInclude(cd => cd.Images)
                .ToListAsync();
		}

		public async Task<bool> RemoveFromCart(Guid CartDetailId)
		{
			using (var dbTrans = await _appDbContext.Database.BeginTransactionAsync())
			{
				try
				{
					var cartDetail = await _appDbContext.CartDetails.FindAsync(CartDetailId);
					if (cartDetail == null) return false;

					_appDbContext.CartDetails.Remove(cartDetail);
					await _appDbContext.SaveChangesAsync();

					await UpdateTotal(cartDetail.CartId);

					await dbTrans.CommitAsync();
					return true;
				}
				catch (Exception ex)
				{
					await dbTrans.RollbackAsync();
					return false;
				}
			}
		}

		private async Task UpdateTotal(Guid cartId)
		{
			var cart = await _appDbContext.Carts.FindAsync(cartId);

			cart.Total = cart.CartDetails == null ? 0 : cart.CartDetails.Sum(cd => cd.Price);

			_appDbContext.Carts.Update(cart);

			await _appDbContext.SaveChangesAsync();
		}
	}
}

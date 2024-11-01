using API.DTO;
using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : Controller
    {
        private readonly ISaleServices _salesService;
        private readonly IProductDetailServices _productDetailService;
        public SalesController(ISaleServices sale, IProductDetailServices productDetailServices)
        {
            _salesService = sale;
            _productDetailService = productDetailServices;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSales()
        {
            var sales = await _salesService.GetAllSalesAsync();
            return Ok(sales);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalesById(Guid id)
        {
            var sale = await _salesService.GetSalesByIdAsync(id);
            if (sale == null)
            {
                return NotFound();
            }
            return Ok(sale);
        }

        [HttpPost]
        public async Task<IActionResult> AddSales([FromBody] SaleDto saleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Lấy danh sách sản phẩm
            var productDetailAll = await _productDetailService.GetAllAsync(); // Thêm await để lấy danh sách

            // Kiểm tra giá trị khuyến mãi hợp lệ
            if (saleDto.Value < 0 || saleDto.Value > 100)
            {
                return BadRequest("Discount value must be between 0 and 100.");
            }

            // Kiểm tra danh sách sản phẩm có trống không
            if (productDetailAll == null || !productDetailAll.Any())
            {
                return BadRequest("Product details not found.");
            }

            // Tạo đối tượng Sales
            var sales = new Sales
            {
                Id = Guid.NewGuid(),
                SaleCode = saleDto.SaleCode,
                Name = saleDto.Name,
                Value = saleDto.Value,
                StartDay = saleDto.StartDay,
                EndDay = saleDto.EndDay,
                Description = saleDto.Description,
                Status = saleDto.Status,
                SaleProducts = new List<SaleProducts>()
            };

            // Thêm các sản phẩm vào khuyến mãi
            foreach (var productDetailId in saleDto.SelectedProductDetailIds)
            {
                var productDetail = productDetailAll.FirstOrDefault(p => p.Id == productDetailId);

                if (productDetail != null)
                {
                    if (productDetail.Price < 0)
                    {
                        return BadRequest($"Product {productDetailId} has an invalid price.");
                    }

                    decimal originalPrice = productDetail.Price;
                    decimal discountAmount = originalPrice * ((decimal)saleDto.Value / 100m);
                    decimal discountedPrice = originalPrice - discountAmount;

                    sales.SaleProducts.Add(new SaleProducts
                    {
                        ProductDetailId = productDetailId,
                        SaleId = sales.Id,
                        EffectiveDate = DateTime.UtcNow,
                        DiscountedPrice = discountedPrice
                    });
                }
            }

            try
            {
                await _salesService.AddSalesAsync(sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetSalesById), new { id = sales.Id }, sales);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSales(Guid id, [FromBody] SaleDto saleDto)
        {
            if (id != saleDto.Id || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSale = await _salesService.GetSalesByIdAsync(id);
            if (existingSale == null)
            {
                return NotFound();
            }

            // Cập nhật thông tin khuyến mãi
            existingSale.SaleCode = saleDto.SaleCode;
            existingSale.Name = saleDto.Name;
            existingSale.Value = saleDto.Value;
            existingSale.StartDay = saleDto.StartDay;
            existingSale.EndDay = saleDto.EndDay;
            existingSale.Description = saleDto.Description;
            existingSale.Status = saleDto.Status;

            // Lấy danh sách ProductDetailId hiện tại
            var currentProductIds = existingSale.SaleProducts.Select(sp => sp.ProductDetailId).ToList();

            // Bỏ bớt các sản phẩm không có trong danh sách mới
            foreach (var productDetailId in currentProductIds)
            {
                if (!saleDto.SelectedProductDetailIds.Contains(productDetailId))
                {
                    var saleProductToRemove = existingSale.SaleProducts.First(sp => sp.ProductDetailId == productDetailId);
                    existingSale.SaleProducts.Remove(saleProductToRemove);
                }
            }

            // Thêm các sản phẩm mới không có trong danh sách hiện tại
            foreach (var productDetailId in saleDto.SelectedProductDetailIds)
            {
                if (!currentProductIds.Contains(productDetailId))
                {
                    var productDetail = await _productDetailService.GetByIdAsync(productDetailId); 

                    if (productDetail != null)
                    {
                        // Tính toán giá giảm
                        decimal originalPrice = productDetail.Price;
                        decimal discountAmount = originalPrice * ((decimal)saleDto.Value / 100m);
                        decimal discountedPrice = originalPrice - discountAmount;

                        existingSale.SaleProducts.Add(new SaleProducts
                        {
                            ProductDetailId = productDetailId,
                            SaleId = existingSale.Id,
                            EffectiveDate = DateTime.Now,
                            DiscountedPrice = discountedPrice // Gán giá đã giảm
                        });
                    }
                }
            }

            await _salesService.UpdateSalesAsync(existingSale);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSales(Guid id)
        {
            var existingSale = await _salesService.GetSalesByIdAsync(id);
            if (existingSale == null)
            {
                return NotFound();
            }

            try
            {
                await _salesService.DeleteSalesAsync(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }
    }
}

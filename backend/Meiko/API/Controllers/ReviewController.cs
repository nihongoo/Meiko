using DataProcessing.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : Controller
    {
        private readonly AppDbContext _appDbContext;

        public ReviewController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetReviews(Guid productId)
        {
            var reviews = await _appDbContext.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> AddReview([FromBody] Review review)
        {
            if (!ModelState.IsValid)
            {
                // Tạo một danh sách lỗi mới và gán thông báo lỗi tiếng Việt
                foreach (var state in ModelState.Values)
                {
                    foreach (var error in state.Errors.ToList())
                    {
                        string errorMessage = error.ErrorMessage;

                        // Chuyển thông báo lỗi sang tiếng Việt
                        if (errorMessage.Contains("ProductId"))
                        {
                            errorMessage = "ProductId không được để trống.";
                        }
                        else if (errorMessage.Contains("UserId"))
                        {
                            errorMessage = "UserId không được để trống.";
                        }
                        else if (errorMessage.Contains("Comment"))
                        {
                            errorMessage = "Bình luận không được để trống.";
                        }
                        else if (errorMessage.Contains("Rating"))
                        {
                            errorMessage = "Đánh giá phải trong khoảng từ 1 đến 5.";
                        }
                        else if (errorMessage.Contains("StringLength"))
                        {
                            errorMessage = "Bình luận phải có độ dài từ 10 đến 1000 ký tự.";
                        }

                        // Xóa lỗi cũ và thêm lỗi mới với thông báo tiếng Việt
                        state.Errors.Clear();
                        state.Errors.Add(new ModelError(errorMessage));
                    }
                }

                return BadRequest(ModelState);
            }

            // Đặt ID mới cho đánh giá
            review.Id = Guid.NewGuid();
            review.CreatedAt = DateTime.UtcNow;

            // Lưu đánh giá vào cơ sở dữ liệu
            _appDbContext.Reviews.Add(review);
            await _appDbContext.SaveChangesAsync();

            return Ok(review);
        }
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] Review updatedReview)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingReview = await _appDbContext.Reviews.FindAsync(id);
            if (existingReview == null)
            {
                return NotFound("Đánh giá không tồn tại.");
            }

            existingReview.Rating = updatedReview.Rating;
            existingReview.Comment = updatedReview.Comment;
            existingReview.CreatedAt = DateTime.UtcNow;  // Cập nhật thời gian chỉnh sửa (nếu cần)

            await _appDbContext.SaveChangesAsync();

            return Ok(existingReview);
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _appDbContext.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound("Đánh giá không tồn tại.");
            }

            _appDbContext.Reviews.Remove(review);
            await _appDbContext.SaveChangesAsync();

            return Ok("Đánh giá đã được xóa.");
        }

    }
}

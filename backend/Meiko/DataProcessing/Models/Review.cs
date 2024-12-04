using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "ProductId không được để trống.")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "UserId không được để trống.")]
        public Guid CustomerId { get; set; }

        [Required(ErrorMessage = "Bình luận không được để trống.")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Bình luận phải có độ dài từ 10 đến 1000 ký tự.")]
        public string Comment { get; set; }

        [Range(1, 5, ErrorMessage = "Đánh giá phải trong khoảng từ 1 đến 5.")]
        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string CustomerName { get; set; }
        public string CustomerAvatar { get; set; }

        public Guid? ParentReviewId { get; set; }
        public int Status { get; set; } = 0;

        public int HelpfulCount { get; set; } = 0;
        public int UnhelpfulCount { get; set; } = 0;
    }
}

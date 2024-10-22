using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Images
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Đường dẫn hình ảnh không được để trống.")]
        [Url(ErrorMessage = "Đường dẫn hình ảnh không hợp lệ.")]
        public string ImgUrl { get; set; }

        [Required(ErrorMessage = "Id chi tiết sản phẩm không được để trống.")]
        public Guid ProductDetailId { get; set; }

        public virtual ProductDetails? ProductDetails { get; set; }
    }
}

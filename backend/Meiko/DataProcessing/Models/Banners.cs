using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Banners
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên banner không được để trống.")]
        [StringLength(100, ErrorMessage = "Tên banner không được vượt quá 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Đường dẫn hình ảnh không được để trống.")]
        [Url(ErrorMessage = "Đường dẫn hình ảnh không hợp lệ.")]
        public string ImageUrl { get; set; }

        [Range(0, 1, ErrorMessage = "Trạng thái phải là 0 (tắt) hoặc 1 (bật).")]
        public int Status { get; set; }
    }
}

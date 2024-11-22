using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Colors
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên màu sắc không được để trống.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Tên màu sắc phải từ 1 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã màu không được để trống.")]
        [RegularExpression(@"^#(?:[0-9a-fA-F]{3}){1,2}$", ErrorMessage = "Mã màu phải là định dạng hex hợp lệ (ví dụ: #FFFFFF hoặc #FFF).")]
        public string Hex { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProductDetails>? ProductDetails { get; set; }
    }
}

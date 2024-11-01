using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Brands
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên thương hiệu không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên thương hiệu phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã thương hiệu không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã thương hiệu phải lớn hơn 0.")]
        public int BrandCode { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [JsonIgnore]
        public virtual ICollection<Products>? Products { get; set; }
    }
}

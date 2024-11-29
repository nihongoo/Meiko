using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Categories
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Tên loại không được bỏ trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải nằm trong khoảng từ 0 đến 5.")]
        public int Status { get; set; }

        [JsonIgnore]
        public virtual ICollection<Products>? Products { get; set; }
    }
}

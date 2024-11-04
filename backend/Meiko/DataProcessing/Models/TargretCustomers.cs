using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class TargretCustomers
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Tên không được bỏ trống")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên phải có từ 3 đến 100 ký tự.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải nằm trong khoảng từ 0 đến 5.")]
        public int Status { get; set; }

        [JsonIgnore]
        public virtual ICollection<Products>? Products { get; set; }
    }
}

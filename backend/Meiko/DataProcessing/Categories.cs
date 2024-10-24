using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing
{
    public class Categories
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Tên loại không được bỏ trống")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên phải có từ 3 đến 100 ký tự.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải nằm trong khoảng từ 0 đến 5.")]
        public string Status { get; set; }

        public virtual ICollection<Products>? Products { get; set; }
    }
}

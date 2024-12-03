using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class CategoryViewModel
    {
        [Required(ErrorMessage = "Tên loại không được bỏ trống")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên phải có từ 3 đến 100 ký tự.")]
        public string Name { get; set; }
    }
}

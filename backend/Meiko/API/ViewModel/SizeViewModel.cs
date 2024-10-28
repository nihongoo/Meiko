using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class SizeViewModel
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên danh mục phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }
    }
}

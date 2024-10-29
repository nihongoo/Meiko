using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class ColorViewModel
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên màu sắc không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên màu sắc phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã màu không được để trống.")]
        [RegularExpression(@"^#(?:[0-9a-fA-F]{3}){1,2}$", ErrorMessage = "Mã màu phải là định dạng hex hợp lệ (ví dụ: #FFFFFF hoặc #FFF).")]
        public string Hex { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }
    }
}

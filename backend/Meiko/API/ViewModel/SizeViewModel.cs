using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class SizeViewModel
    {

        [Required(ErrorMessage = "Tên danh mục không được để trống.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }
    }
}

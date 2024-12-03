using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class BrandViewModel
    {

        [Required(ErrorMessage = "Tên thương hiệu không được để trống.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã thương hiệu không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã thương hiệu phải lớn hơn 0.")]
        public int BrandCode { get; set; }

    }
}

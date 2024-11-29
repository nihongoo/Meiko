using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class MaterialViewModel
    {
        [Required(ErrorMessage = "Tên chất liệu không được bỏ trống")]
        public string Name { get; set; }
    }
}

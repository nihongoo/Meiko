using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class TargretCustomerViewModel
    {
        [Required(ErrorMessage = "Tên không được bỏ trống")]
        
        public string Name { get; set; }
    }
}

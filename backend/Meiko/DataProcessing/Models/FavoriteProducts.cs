using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class FavoriteProducts
    {
        [Required(ErrorMessage = "Id sản phẩm không được để trống.")]
        public Guid IdProduct { get; set; }

        [Required(ErrorMessage = "Id khách hàng không được để trống.")]
        public Guid IdCustomer { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }

        public virtual Customers? Customers { get; set; }
        public virtual Products? Products { get; set; }
    }
}

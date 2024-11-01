using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class SaleProducts
    {
        [Key]
        public Guid ProductDetailId { get; set; }
        [Key]
        public Guid SaleId { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? DiscountedPrice { get; set; }

        public ProductDetails Productdetail { get; set; }
        public Sales sales { get; set; }
    }
}

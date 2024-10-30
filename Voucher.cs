using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Voucher
    {
        [Key]
        public int IdVoucher { get; set; } 
        public string VoucherCode { get; set; }
        public decimal Value { get; set; }
        public int Quantity { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public bool Status { get; set; } 
    }
}

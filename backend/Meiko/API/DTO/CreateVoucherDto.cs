using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class CreateVoucherDto
    {
        [Required]
        public string VoucherCode { get; set; }

        [Required]
        public double Value { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime StartDay { get; set; }

        [Required]
        public DateTime EndDay { get; set; }

        [Required]
        public double MinimumOrderAmount { get; set; }

        [Required]
        public List<Guid> CustomerIds { get; set; }
    }
}

using DataProcessing.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class VoucherDto
    {
        public Guid Id { get; set; }
        public string VoucherCode { get; set; }
        public double Value { get; set; }
        public double MinimumOrderAmount { get; set; }
        public int Quantity { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public int Status { get; set; }
        public bool IsPublic { get; set; }
    }
}

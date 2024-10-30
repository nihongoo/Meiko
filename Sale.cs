namespace API.Models
{
    public class Sale
    {
        public int Id { get; set; } 
        public string SaleCode { get; set; }
        public string Name { get; set; }
        public decimal Value { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
    }
}

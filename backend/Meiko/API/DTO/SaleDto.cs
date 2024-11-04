namespace API.DTO
{
    public class SaleDto
    {
        public Guid Id { get; set; }
        public string SaleCode { get; set; }
        public string Name { get; set; }
        public double Value { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public List<Guid> SelectedProductDetailIds { get; set; }
    }
}

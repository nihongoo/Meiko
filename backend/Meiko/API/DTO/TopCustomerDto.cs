namespace API.DTO
{
	public class TopCustomerDto
	{
		public Guid? CustomerId { get; set; }
		public string Name { get; set; }
		public string PhoneNumber { get; set; }
		public decimal AmountSpent { get; set; }
	}
}

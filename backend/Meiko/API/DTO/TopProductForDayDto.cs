namespace API.DTO
{
	public class TopProductForDayDto
	{
		public DateTime? Date { get; set; }
		public string Name { get; set; }
		public string Color { get; set; }
		public string Size { get; set; }
		public int Sold { get; set; }
		public decimal Revenue { get; set; }
	}
}

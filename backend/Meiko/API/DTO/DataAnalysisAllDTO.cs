namespace API.DTO
{
	public class DataAnalysisAllDTO
	{
		public int AllQuantityProduct { get; set; }
		public decimal TotalRevenue { get; set; }
		public decimal Profit { get; set; }
		public decimal QuantityGrowth { get; set; }
		public decimal RevenueGrowth { get; set; }
		public decimal ProfitGrowth { get; set; }
		public object ComparedToLastWeek { get; set; }
	}
}

using System;
using DataProcessing.Models;

namespace API.ViewModel
{
	public class ListBillDetailViewModel
	{
		public Guid Id { get; set; }//bill
		public string ImgUrl { get; set; }//product or detail
		public string Name { get; set; }//product
		public decimal Price { get; set; }//detail
		public string Size { get; set; }//detail
		public string Color { get; set; }//detail
		public int Quantity { get; set; }//bill
		public int status { get; set; }//bill
		public Guid ProductDetailId { get; set; }
	}
}

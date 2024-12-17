using System.ComponentModel.DataAnnotations;

namespace API.Extention
{
	public class FutureDateAttribute : ValidationAttribute
	{
		protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
		{
			if (value is DateTime dateTime)
			{
				if (dateTime.Date < DateTime.Now.Date)
				{
					return new ValidationResult("Ngày nhập không được nhỏ hơn ngày hiện tại.");
				}
			}
			return ValidationResult.Success;
		}
	}
}

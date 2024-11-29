using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

public static class EnumExtensions
{
	public static string GetDisplayName(this Enum enumValue)
	{
		// Lấy kiểu của enum
		var enumType = enumValue.GetType();

		// Lấy thông tin Field tương ứng với enumValue
		var fieldInfo = enumType.GetField(enumValue.ToString());

		// Kiểm tra xem có attribute Display hay không
		var displayAttribute = fieldInfo?.GetCustomAttributes(typeof(DisplayAttribute), false)
			.FirstOrDefault() as DisplayAttribute;

		// Trả về giá trị Name từ DisplayAttribute nếu có, nếu không thì trả về giá trị mặc định của enum
		return displayAttribute?.Name ?? enumValue.ToString();
	}
}

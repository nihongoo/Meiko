using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Sales
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã khuyến mãi không được để trống.")]
        [StringLength(20, ErrorMessage = "Mã khuyến mãi không được vượt quá 20 ký tự.")]
        public string SaleCode { get; set; }

        [Required(ErrorMessage = "Tên khuyến mãi không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên khuyến mãi phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Giá trị khuyến mãi không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá trị khuyến mãi phải lớn hơn hoặc bằng 0.")]
        public double Value { get; set; }

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống.")]
        [DataType(DataType.Date)]
        public DateTime StartDay { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống.")]
        [DataType(DataType.Date)]
        [CustomDateRange("StartDay", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu.")]
        public DateTime EndDay { get; set; }

        [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        public virtual ICollection<ProductDetails>? ProductDetails { get; set; }
    }
}
public class CustomDateRange : ValidationAttribute
{
    private readonly string _startDatePropertyName;

    public CustomDateRange(string startDatePropertyName)
    {
        _startDatePropertyName = startDatePropertyName;
    }

    protected override ValidationResult? IsValid(object value, ValidationContext validationContext)
    {
        var startDateProperty = validationContext.ObjectType.GetProperty(_startDatePropertyName);
        if (startDateProperty == null)
            return new ValidationResult($"Không tìm thấy thuộc tính {_startDatePropertyName}.");

        var startDateValue = (DateTime)startDateProperty.GetValue(validationContext.ObjectInstance);

        if (value is DateTime endDate && endDate <= startDateValue)
        {
            return new ValidationResult(ErrorMessage);
        }

        return ValidationResult.Success;
    }
}
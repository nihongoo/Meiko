using System;

public class ProductDetails
{
    public int Id { get; set; }                        // PK - Khóa chính
    public string ProductDetailCode { get; set; }     // Mã chi tiết sản phẩm
    public int Quantity { get; set; }                 // Số lượng
    public double Weight { get; set; }                // Trọng lượng sản phẩm
    public decimal ImportPrice { get; set; }          // Giá nhập
    public decimal Price { get; set; }                // Giá bán
    public DateTime CreateTime { get; set; }          // Thời gian tạo chi tiết sản phẩm
    public string Status { get; set; }                // Trạng thái chi tiết sản phẩm

    // Các thuộc tính khóa ngoại
    public int ProductId { get; set; }                // FK - Khóa ngoại đến bảng Product
    public int ColorId { get; set; }                  // FK - Khóa ngoại đến bảng Color
    public int SaleId { get; set; }                   // FK - Khóa ngoại đến bảng Sale
    public int SizeId { get; set; }
}

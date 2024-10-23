using System;
using System.Security.Cryptography.X509Certificates;

public class Products
{
    public int Id { get; set; }                
    public string Name { get; set; }           
    public string Description { get; set; }    
    public string ProductCode { get; set; }    
    public string Image { get; set; }          
    public int WarrantyPeriod { get; set; }    
    public DateTime CreateTime { get; set; }   
    public string Status { get; set; }         

    
    public int MaterialId { get; set; }        
    public int BrandId { get; set; }           
    public int CategoryId { get; set; }        
    public int TargetCustomerId { get; set; }
}

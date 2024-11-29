using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Images
    {
        [Key]
        public Guid Id { get; set; }

        public string ImgUrl { get; set; }

        public string PublicId { get; set; }

        public Guid ProductDetailId { get; set; }

        [JsonIgnore]
        public virtual ProductDetails? ProductDetails { get; set; }
    }
}

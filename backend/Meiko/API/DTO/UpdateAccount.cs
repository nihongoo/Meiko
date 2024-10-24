using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class UpdateAccount
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public int Status { get; set; }

        public string Role { get; set; }
    }
}

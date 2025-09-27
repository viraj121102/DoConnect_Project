using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Dtos
{
    public class RegisterDto
    {
        [Required] public string? Username { get; set; }
        [Required] public string? Password { get; set; }
        [Required] public string Role { get; set; } = UserRoles.User;
    }

    public class LoginDto
    {
        [Required] public string? Username { get; set; }
        [Required] public string? Password { get; set; }
    }
}

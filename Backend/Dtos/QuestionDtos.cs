using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class QuestionCreateDto
    {
        [Required] public string? QuestionTitle { get; set; }
        [Required] public string? QuestionText { get; set; }
    }
}

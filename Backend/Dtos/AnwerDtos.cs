using System.ComponentModel.DataAnnotations;
namespace Backend.Dtos;
public class AnswerCreateDto
    {
        public int QuestionId { get; set; }
        public string AnswerText { get; set; } 
    }

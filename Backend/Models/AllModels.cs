using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class User
{
    public int UserId { get; set; }
    [Required, MaxLength(100)]
    public string? Username { get; set; }
    [Required]
    public string? Password { get; set; }
    public string? Role { get; set; }
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
public class Question
{
    public int QuestionId { get; set; }
    public string? QuestionTitle { get; set; }
    public string? QuestionText { get; set; }

    public string? Status { get; set; }

    [ForeignKey("Users")]
    public int UserId { get; set; }
    public User? Users { get; set; }
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public ICollection<Image> Images { get; set; } = new List<Image>();
 

}
public class Answer
{
    public int AnswerId { get; set; }
    public string? AnswerText { get; set; }
    public string? Status { get; set; }

    [ForeignKey("Question")]
    public int QuestionId { get; set; }
    public Question? Question { get; set; }

    [ForeignKey("Users")]
    public int UserId { get; set; }

    public User? Users { get; set; }
public ICollection<Image> Images { get; set; } = new List<Image>();

}

public class Image
{
    public int ImageId { get; set; }
    public string Path { get; set; } = string.Empty;

    [ForeignKey("Question")]
    public int QuestionId { get; set; }
    public Question? Question { get; set; }

    [ForeignKey("Answer")]
    public int? AnswerId { get; set; }
    public Answer? Answer { get; set; }
    

}
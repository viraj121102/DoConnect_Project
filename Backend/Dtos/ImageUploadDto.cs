using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class ImageUploadDto
    {
         public IFormFile? File { get; set; }
        public int? QuestionId { get; set; }
        public int? AnswerId { get; set; }
    }
}
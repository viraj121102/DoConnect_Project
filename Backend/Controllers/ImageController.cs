using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly DoConnectContext _db;
        private readonly IWebHostEnvironment _env;

        public ImagesController(DoConnectContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // ✅ Upload image for Question
        [Authorize(Roles = UserRoles.User + "," + UserRoles.Admin)]
        [HttpPost("upload/question/{questionId}")]
        public async Task<IActionResult> UploadForQuestion(int questionId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Save file in wwwroot/uploads
            var uploadPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var img = new Image
            {
                Path = "/uploads/" + fileName,
                QuestionId = questionId,
                AnswerId = null
            };

            _db.Images.Add(img);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Question image uploaded", img.ImageId, img.Path });
        }

        // ✅ Upload image for Answer
        [Authorize(Roles = UserRoles.User + "," + UserRoles.Admin)]
        [HttpPost("upload/answer/{answerId}")]
        public async Task<IActionResult> UploadForAnswer(int answerId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Save file in wwwroot/uploads
            var uploadPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Find related answer to get QuestionId
            var ans = await _db.Answers.FindAsync(answerId);
            if (ans == null) return NotFound("Answer not found");

            var img = new Image
            {
                Path = "/uploads/" + fileName,
                QuestionId = ans.QuestionId,
                AnswerId = answerId
            };

            _db.Images.Add(img);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Answer image uploaded", img.ImageId, img.Path });
        }
    }
}

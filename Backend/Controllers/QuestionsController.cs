using System.Security.Claims;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly DoConnectContext _db;
        public QuestionsController(DoConnectContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var questions = await _db.Questions
                .Include(q => q.Users)
                .Include(q => q.Images)
                .Where(q => q.Status == ModerationStatus.Approved)
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionTitle,
                    q.QuestionText,
                    q.Status,
                    Author = q.Users.Username,
                    Images = q.Images.Select(img => new
                    {
                        img.ImageId,
                        img.Path
                    })
                })
                .ToListAsync();

            return Ok(questions);
        }

        // Get single question (with answers + images)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var q = await _db.Questions
        .Include(q => q.Users)
        .Include(q => q.Answers).ThenInclude(a => a.Users)
        .Include(q => q.Answers).ThenInclude(a => a.Images)
        .Include(q => q.Images)
        .FirstOrDefaultAsync(x => x.QuestionId == id && x.Status == ModerationStatus.Approved);

            if (q == null) return NotFound();

            return Ok(new
            {
                q.QuestionId,
                q.QuestionTitle,
                q.QuestionText,
                q.Status,
                Author = q.Users.Username,
                QuestionImages = q.Images.Select(i => new { i.ImageId, i.Path }),
                Answers = q.Answers
                    .Where(a => a.Status == ModerationStatus.Approved)
                    .Select(a => new
                    {
                        a.AnswerId,
                        a.AnswerText,
                        Author = a.Users.Username,
                        AnswerImages = a.Images.Select(i => new { i.ImageId, i.Path })
                    })
            });
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var questions = await _db.Questions
                .Include(q => q.Users)
                .Where(q => q.Status == ModerationStatus.Pending)
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionTitle,
                    q.QuestionText,
                    q.Status,
                    Author = q.Users.Username
                })
                .ToListAsync();

            return Ok(questions);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuestionCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var q = new Question
            {
                QuestionTitle = dto.QuestionTitle,
                QuestionText = dto.QuestionText,
                UserId = userId,
                Status = ModerationStatus.Pending
            };

            _db.Questions.Add(q);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Question created", q.QuestionId });
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] QuestionCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role); // Role nikaalo (Admin/User)

            // Agar Admin hai to userId check mat karo
            var q = userRole == "Admin"
                ? await _db.Questions.FirstOrDefaultAsync(x => x.QuestionId == id)
                : await _db.Questions.FirstOrDefaultAsync(x => x.QuestionId == id && x.UserId == userId);

            if (q == null) return NotFound("Question not found or not yours");

            q.QuestionTitle = dto.QuestionTitle;
            q.QuestionText = dto.QuestionText;
            q.Status = ModerationStatus.Pending; // reset to pending after edit

            await _db.SaveChangesAsync();
            return Ok(new { message = "Question updated, waiting for approval" });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var q = await _db.Questions.FirstOrDefaultAsync(x => x.QuestionId == id && x.UserId == userId);

            if (q == null) return NotFound("Question not found or not yours");

            q.Status = ModerationStatus.deleted;
            _db.Questions.Update(q);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Question deleted" });
        }
        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}/admin")]
        public async Task<IActionResult> AdminDelete(int id)
        {
            var q = await _db.Questions.FirstOrDefaultAsync(x => x.QuestionId == id);
            if (q == null) return NotFound("Question not found");

            q.Status = ModerationStatus.deleted;
            _db.Questions.Update(q);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Question deleted by admin" });
        }



        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var q = await _db.Questions.FindAsync(id);
            if (q == null) return NotFound();

            q.Status = ModerationStatus.Approved;
            await _db.SaveChangesAsync();

            return Ok("Approved");
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var q = await _db.Questions.FindAsync(id);
            if (q == null) return NotFound();

            q.Status = ModerationStatus.Rejected;
            await _db.SaveChangesAsync();

            return Ok("Rejected");
        }
        [Authorize]
        [HttpGet("search")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SearchApprovedUnansweredQuestions([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Search query cannot be empty." });

            var results = await _db.Questions
                .Include(q => q.Users)
                .Where(q => q.Status == ModerationStatus.Approved &&
                            !q.Answers.Any(a => a.Status == ModerationStatus.Approved) && 
                            (q.QuestionTitle.Contains(query) || q.QuestionText.Contains(query)))
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionText,
                    q.QuestionTitle,
                    askedBy = q.Users.Username,
                    // imagePath = _db.Images
                    //     .Where(img => img == q.QuestionId && img.answerId == null)
                    //     .Select(img => img.ImagePath)
                    //     .FirstOrDefault()
                })
                .ToListAsync();

            if (!results.Any())
                return Ok(new { message = "No matching approved and unanswered questions found." });

            return Ok(results);
        }

    }
    
    }


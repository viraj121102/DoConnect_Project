using System.Security.Claims;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnswersController : ControllerBase
{

        private readonly DoConnectContext _db;
        public AnswersController(DoConnectContext db) => _db = db;

  [HttpGet("question/{questionId}")]
        public async Task<IActionResult> GetByQuestion(int questionId)
        {
            var answers = await _db.Answers
                .Include(a => a.Users)
                .Include(a => a.Images)
                .Where(a => a.QuestionId == questionId && a.Status == ModerationStatus.Approved)
                .Select(a => new {
                    a.AnswerId,
                    a.AnswerText,
                    a.Status,
                    Author = a.Users.Username,
                    Images = a.Images.Select(img => new {
                        img.ImageId,
                        img.Path
                    })
                })
                .ToListAsync();

            return Ok(answers);
        }
    [HttpGet]
        public async Task<IActionResult> GetAll(int questionId)
        {
            var answers = await _db.Answers.Include(a => a.Users)
                .Where(a => a.QuestionId == questionId && a.Status == ModerationStatus.Approved)
                .Select(a => new {
                    a.AnswerId,
                    a.AnswerText,
                    a.Status,
                    Author = a.Users.Username
                })
                .ToListAsync();

            return Ok(answers);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var answers = await _db.Answers
                .Include(a => a.Users)
                .Where(a => a.Status == ModerationStatus.Pending)
                .Select(a => new
                {
                    a.AnswerId,
                    a.AnswerText,
                    a.Status,
                    Author = a.Users.Username
                })
                .ToListAsync();

            return Ok(answers);
        }

  [Authorize]
[HttpPost]
public async Task<IActionResult> Create([FromBody] AnswerCreateDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    var ans = new Answer
    {
        AnswerText = dto.AnswerText,
        QuestionId = dto.QuestionId,   // ✅ dto se lo
        UserId = userId,
        Status = ModerationStatus.Pending
    };

    _db.Answers.Add(ans);
    await _db.SaveChangesAsync();

    return Ok(new { ans.AnswerId, message = "Answer created" });
}
    [Authorize]
[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] AnswerCreateDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var userRole = User.FindFirstValue(ClaimTypes.Role);

    var a = userRole == "Admin"
        ? await _db.Answers.FirstOrDefaultAsync(x => x.AnswerId == id)
        : await _db.Answers.FirstOrDefaultAsync(x => x.AnswerId == id && x.UserId == userId);

    if (a == null) return NotFound("Answer not found or not yours");

    a.AnswerText = dto.AnswerText;
    a.Status = ModerationStatus.Pending; // reset to pending

    await _db.SaveChangesAsync();
    return Ok(new { message = "Answer updated, waiting for approval" });
}


    // User delete (apna hi answer)
    [Authorize(Roles = UserRoles.User)]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var ans = await _db.Answers.FirstOrDefaultAsync(a => a.AnswerId == id && a.UserId == userId);

    if (ans == null) return NotFound("Answer not found or not yours");

    ans.Status = ModerationStatus.deleted;
    _db.Answers.Update(ans);
    await _db.SaveChangesAsync();

    return Ok(new { message = "Answer deleted" });
}

// ✅ Admin delete (kisi bhi answer)
[Authorize(Roles = UserRoles.Admin)]
[HttpDelete("{id}/admin")]
public async Task<IActionResult> AdminDelete(int id)
{
    var ans = await _db.Answers.FirstOrDefaultAsync(a => a.AnswerId == id);
    if (ans == null) return NotFound("Answer not found");

    ans.Status = ModerationStatus.deleted;
    _db.Answers.Update(ans);
    await _db.SaveChangesAsync();

    return Ok(new { message = "Answer deleted by admin" });
}


        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var ans = await _db.Answers.FindAsync(id);
            if (ans == null) return NotFound();

            ans.Status = ModerationStatus.Approved;
            await _db.SaveChangesAsync();

            return Ok("Approved");
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var ans = await _db.Answers.FindAsync(id);
            if (ans == null) return NotFound();

            ans.Status = ModerationStatus.Rejected;
            await _db.SaveChangesAsync();

            return Ok("Rejected");
        }
    }
    


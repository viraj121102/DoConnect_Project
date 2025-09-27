using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class DoConnectContext:DbContext
    {
                 public DoConnectContext(DbContextOptions<DoConnectContext> options ):base(options)
                 {
                    
                 }

        public DbSet<User> Users { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Image> Images { get; set; }
    }
}
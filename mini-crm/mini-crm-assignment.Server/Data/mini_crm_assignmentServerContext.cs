using Microsoft.EntityFrameworkCore;
using mini_crm_assignment.Server.Models;

namespace mini_crm_assignment.Server.Data
{
    public class Mini_crm_assignmentServerContext(DbContextOptions<Mini_crm_assignmentServerContext> options) : DbContext(options)
    {
        public DbSet<Customer> Customer { get; set; } = default!;
        public DbSet<Contact> Contact { get; set; } = default!;
    }
}

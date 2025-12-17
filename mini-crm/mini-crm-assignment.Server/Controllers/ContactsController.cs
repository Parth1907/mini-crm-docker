using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mini_crm_assignment.Server.Data;
using mini_crm_assignment.Server.Models;

namespace mini_crm_assignment.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController(Mini_crm_assignmentServerContext context) : ControllerBase
    {

        // GET: api/Contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContact([FromQuery] Guid? customerId)
        {
            IQueryable<Contact> query = context.Contact;

            // Filter by customerId if provided
            if (customerId.HasValue)
            {
                query = query.Where(c => c.CustomerId == customerId.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(Guid id)
        {
            var contact = await context.Contact.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // PUT: api/Contacts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(Guid id, Contact contact)
        {
            contact.Id = id;

            context.Entry(contact).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Contacts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            context.Contact.Add(contact);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(Guid id)
        {
            var contact = await context.Contact.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            context.Contact.Remove(contact);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactExists(Guid id)
        {
            return context.Contact.Any(e => e.Id == id);
        }
    }
}

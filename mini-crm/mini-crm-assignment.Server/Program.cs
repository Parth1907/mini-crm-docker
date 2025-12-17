using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using mini_crm_assignment.Server.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<Mini_crm_assignmentServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("mini_crm_assignmentServerContext") ?? throw new InvalidOperationException("Connection string 'mini_crm_assignmentServerContext' not found.")));

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                  .AllowAnyOrigin()
                  //.WithOrigins(
                  //    "https://localhost:51707/"
                  //) // your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

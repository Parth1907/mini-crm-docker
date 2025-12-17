using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json");

builder.Services.AddOcelot(builder.Configuration);
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

app.MapGet("/", () => "Hello World!");
app.UseOcelot().Wait();
app.UseCors("AllowFrontend");

app.Run();

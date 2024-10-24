<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
using API.Extention;
=======
=======
>>>>>>> cuong
using API.IServices;
using API.Services;
using DataProcessing.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
<<<<<<< HEAD
>>>>>>> cuong
=======
>>>>>>> cuong

=======
>>>>>>> parent of f60d5c4 (Đăng ký/ Đăng nhập)
namespace Meiko
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);
<<<<<<< HEAD
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));
            //Service
            builder.Services.AddScoped<IAccountServices, AccountService>();
            // Th�m Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();
<<<<<<< HEAD

<<<<<<< HEAD
			builder.Services.AddExtentionsService(builder.Configuration);

			// Add services to the container.
=======
=======

>>>>>>> cuong
            //JWT Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });
            // Add services to the container.
<<<<<<< HEAD
>>>>>>> cuong
=======
>>>>>>> cuong
=======

			// Add services to the container.
>>>>>>> parent of f60d5c4 (Đăng ký/ Đăng nhập)

			builder.Services.AddControllers();
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			app.UseCors("AllowSpecificOrigins");

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}
			app.UseCors("AllowAllOrigins");

			app.UseHttpsRedirection();

			app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
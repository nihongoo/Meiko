using API.IServices;
using API.Services;
using DataProcessing.Configurations;
using DataProcessing.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Meiko
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));
            //Configure
            builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
            //Service
            builder.Services.AddScoped<IAccountServices, AccountService>();
            builder.Services.AddScoped<IAddressServices, AddressServices>();
            builder.Services.AddScoped<IStaffServices, StaffServices>();
            builder.Services.AddScoped<ICustomerServices, CustomerServices>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IOtpService, OtpService>();
            builder.Services.AddScoped<IMaterialServices, MaterialServices>();
            builder.Services.AddScoped<IBrandServices, BrandServices>();
            builder.Services.AddScoped<ICategoryServices, CategoryServices>();
            builder.Services.AddScoped<IColorServices, ColorServices>();
            builder.Services.AddScoped<ISizeServices, SizeServices>();
            builder.Services.AddScoped<ITargetServices, TargetServices>();
            builder.Services.AddScoped<IProductServices, ProductServices>();
            builder.Services.AddScoped<IProductDetailServices, ProductDetailServices>();
            builder.Services.AddScoped<ICartServices, CartServices>();
            builder.Services.AddScoped<ICartDetailServices, CartDetailServices>();
            builder.Services.AddScoped<ISaleServices, SaleServices>();
            builder.Services.AddScoped<ISaleProductServices, SaleProductServices>();
            builder.Services.AddScoped<IVoucherServices, VoucherServices>();
            builder.Services.AddScoped<IImageServices, ImageServices>();

            // Thêm Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

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

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();
			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthentication();

            app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
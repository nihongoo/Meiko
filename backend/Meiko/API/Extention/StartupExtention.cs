using API.Extention;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Precious.core.Extention
{
	public static class StartupExtentions
	{
		public static void AddExtentionsService(this IServiceCollection services, IConfiguration configuration)
		{
			// Cấu hình Cloudinary
			var cloudinaryAccount = new CloudinaryDotNet.Account(
				"dtsqxauba",
				"499966471635793",
				"JF6fw732zAyZAZ6_lpKaI0S_mH4");

			var cloudinary = new CloudinaryDotNet.Cloudinary(cloudinaryAccount);

			services.AddSingleton(cloudinary);
			services.AddScoped(typeof(ToolDB<>));

			//Cấu hình CORS
			services.AddCors(options =>
			{
				options.AddPolicy("AllowSpecificOrigins",
					builder => builder.WithOrigins("http://localhost:3000")
									 .AllowAnyMethod()
									 .AllowAnyHeader());
			});
		}
	}
}

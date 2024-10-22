using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;


namespace API.Extention
{
	public static class StartupExtention
	{
		public static void AddExtentionsService(this IServiceCollection services, IConfiguration configuration)
		{
			var cloudinaryAccount = new CloudinaryDotNet.Account(
				"dtsqxauba",
				"499966471635793",
				"JF6fw732zAyZAZ6_lpKaI0S_mH4");

			var cloudinary = new CloudinaryDotNet.Cloudinary(cloudinaryAccount);
			services.AddSingleton(cloudinary);
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

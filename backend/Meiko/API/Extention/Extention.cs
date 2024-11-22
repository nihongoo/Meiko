using System.Text.RegularExpressions;

namespace API.Extention
{
	public static class Extention
	{
		public static string GenerateSerialCode()
		{
			return Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper();
		}

		public static string ExtractPublicIdFromUrl(string imageUrl)
		{
			// Regex để tách public_id
			var regex = new Regex(@"image\/upload\/[^\/]+\/([^\.]+)", RegexOptions.IgnoreCase);
			var match = regex.Match(imageUrl);

			if (match.Success)
			{
				return match.Groups[1].Value;
			}

			return string.Empty;
		}
	}
}

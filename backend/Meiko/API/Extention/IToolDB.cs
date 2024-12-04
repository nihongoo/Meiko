using DataProcessing.Models;

namespace API.Extention
{
	public interface IToolDB<T> where T : class
	{
		Task<List<T>> Search(string query, string prod);
	}
}

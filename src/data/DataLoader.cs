using System.Text.Json;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Nest;

namespace assignment_wt2
{
    public class DataLoader
    {
        private readonly string _filePath;

        public DataLoader(string filePath)
        {
            _filePath = filePath;
        }

        public async Task<List<Data>> LoadDataAsync()
        {
            try
            {
                // Read the content of the file asynchronously
                string jsonString = await File.ReadAllTextAsync(_filePath);

                // Deserialize JSON into List<Data> asynchronously
                var dataList = JsonSerializer.Deserialize<List<Data>>(jsonString);
                
                // Set timestamp to 1st January 2019
                var timestamp = new DateTime(2019, 1, 1);
                dataList.ForEach(data => data.timestamp = timestamp);

                // Check if deserialization was successful
                if (dataList == null)
                    throw new Exception("Deserialization failed; the list is null.");

                // Filter out entries where availability_365 is 0
                var filteredDataList = dataList
                    .Where(data => data.availability_365 > 0)
                    .Where(data => data.price > 0)
                    .ToList();
                
                Console.WriteLine("Data loaded successfully");
                return filteredDataList;
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine($"File not found: {ex.Message}");
                 return new List<Data>();
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error during JSON deserialization: {ex.Message}");
                 return new List<Data>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                 return new List<Data>();
            }
        }
    }
}

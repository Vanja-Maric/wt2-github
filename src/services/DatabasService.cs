using System;
using System.Collections.Generic;
using Npgsql; // Use Npgsql for PostgreSQL
using System.Threading.Tasks;
using assignment_wt2.src.data;

namespace assignment_wt2
{
    public class DatabaseService
    {
        private readonly string? _connectionString;

        public DatabaseService()
        {
            var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var dbdatabase = Environment.GetEnvironmentVariable("POSTGRES_DB");
            var dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
            _connectionString = $"Host=database;Database={dbdatabase};User Id={dbUser};Password={dbPassword};";
        }

        public async Task EnsureTableExistsAsync()
        {
            try
            {
                Console.WriteLine("Ensuring the Data table exists...");
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var createTableQuery = @"
                    CREATE TABLE IF NOT EXISTS Data (
                        Id SERIAL PRIMARY KEY,
                        Name TEXT NOT NULL,
                        NeighbourhoodGroup TEXT,
                        Neighbourhood TEXT,
                        RoomType TEXT,
                        Price INT,
                        NumberOfReviews INT,
                        Timestamp TIMESTAMP
                    );";

                using var command = new NpgsqlCommand(createTableQuery, connection);
                await command.ExecuteNonQueryAsync();
                Console.WriteLine("Data table ensured.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while ensuring the Data table exists: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        public async Task AddDataAsync(IEnumerable<Data> dataList)
        {
            try
            {
                Console.WriteLine("Connecting to the database...");
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();
                Console.WriteLine("Database connection established.");

                foreach (var data in dataList)
                {
                    var query = "INSERT INTO Data (Id, Name, NeighbourhoodGroup, Neighbourhood, RoomType, Price, NumberOfReviews, Timestamp) " +
                                "VALUES (@Id, @Name, @NeighbourhoodGroup, @Neighbourhood, @RoomType, @Price, @NumberOfReviews, @Timestamp)";

                    using var command = new NpgsqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Id", data.id);
                    command.Parameters.AddWithValue("@Name", data.name);
                    command.Parameters.AddWithValue("@NeighbourhoodGroup", data.neighbourhood_group);
                    command.Parameters.AddWithValue("@Neighbourhood", data.neighbourhood);
                    command.Parameters.AddWithValue("@RoomType", data.room_type);
                    command.Parameters.AddWithValue("@Price", data.price);
                    command.Parameters.AddWithValue("@NumberOfReviews", data.number_of_reviews);
                    command.Parameters.AddWithValue("@Timestamp", data.timestamp);
                    await command.ExecuteNonQueryAsync();
                }

                Console.WriteLine("All data successfully inserted into the database.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while connecting to the database or inserting data: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        public async Task<Dictionary<string, int>> GetRoomTypeDistributionAsync()
        {
            var result = new Dictionary<string, int>();

            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var query = "SELECT roomtype, COUNT(*) AS count FROM Data GROUP BY roomtype;";
                using var command = new NpgsqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var roomType = reader.GetString(0);
                    var count = reader.GetInt32(1);
                    result[roomType] = count;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching room type distribution: {ex.Message}");
                throw;
            }

            return result;
        }

        public async Task<Dictionary<string, double>> GetAveragePriceByRoomTypeAsync()
        {
            var result = new Dictionary<string, double>();

            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var query = "SELECT roomtype, AVG(price) AS averageprice FROM Data GROUP BY roomtype;";
                using var command = new NpgsqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var roomType = reader.GetString(0);
                    var averagePrice = reader.GetDouble(1);
                    result[roomType] = averagePrice;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching average price by room type: {ex.Message}");
                throw;
            }

            return result;
        }

        public async Task<Dictionary<string, double>> GetAveragePriceByNeighborhoodAsync()
        {
            var result = new Dictionary<string, double>();

            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var query = "SELECT neighbourhood, AVG(price) AS averageprice FROM Data GROUP BY neighbourhood;";
                using var command = new NpgsqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var neighborhood = reader.GetString(0);
                    var averagePrice = reader.GetDouble(1);
                    result[neighborhood] = averagePrice;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching average price by neighborhood: {ex.Message}");
                throw;
            }

            return result;
        }

        public async Task<IEnumerable<string>> GetNeighborhoodsAsync()
        {
            try
            {
                var neighborhoods = new List<string>();


                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT DISTINCT neighbourhoodgroup FROM Data;";
                using var command = new NpgsqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    neighborhoods.Add(reader.GetString(0));
                }

                return neighborhoods;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching neighborhoods: {ex.Message}");
            }
        }

        public async Task<Dictionary<int, int>> GetPriceDistributionAsync(string neighborhood, string roomType)
        {
            var result = new Dictionary<int, int>();

            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"
        SELECT (price / 50) * 50 AS price_bucket, COUNT(*) AS count
        FROM data
        WHERE neighbourhoodgroup = @neighborhood AND roomtype = @roomType
        GROUP BY price_bucket
        ORDER BY price_bucket
    ", conn);

            cmd.Parameters.AddWithValue("neighborhood", neighborhood);
            cmd.Parameters.AddWithValue("roomType", roomType);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var bucket = reader.GetInt32(0);
                var count = reader.GetInt32(1);
                result[bucket] = count;
            }

            return result;
        }

    }
}
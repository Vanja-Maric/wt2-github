using assignment_wt2.src.data;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Npgsql;
using assignment_wt2;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();

// Register CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000")  // Replace with frontend URL
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddSingleton<DatabaseService>();

var app = builder.Build();

// Enable CORS
app.UseCors("AllowSpecificOrigin");

app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

// Run async startup logic before starting the app
await InitializeAsync(app.Services);

// Start the web application
app.Run();


// 👇 Async initialization logic
static async Task InitializeAsync(IServiceProvider services)
{
    Console.WriteLine("Application starting...");

    // Load environment variables from .env file
    DotNetEnv.Env.Load();

    using var scope = services.CreateScope();
    var provider = scope.ServiceProvider;
    var databaseService = provider.GetRequiredService<DatabaseService>();

    var retryPolicy = Policy
        .Handle<Exception>()
        .WaitAndRetryAsync(10, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

    var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
    var dbDatabase = Environment.GetEnvironmentVariable("POSTGRES_DB");
    var dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
    var connectionString = $"Host=database;Database={dbDatabase};User Id={dbUser};Password={dbPassword};";
    Console.WriteLine($"Connection string: {connectionString}");

   await retryPolicy.ExecuteAsync(async () =>
{
    try
    {
        Console.WriteLine("Trying DB connection...");
        
        using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        
        Console.WriteLine("Connected to the database.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error connecting to the database: {ex.Message}");
        // You can also log the full exception details for more insight
        Console.WriteLine($"Exception details: {ex.ToString()}");
    }
});


    var dataLoader = new DataLoader("src/NewYork.json");
    List<Data> dataList = await dataLoader.LoadDataAsync();

    if (dataList.Any())
    {
        var recordsToDisplay = dataList.Take(5);
        foreach (var record in recordsToDisplay)
        {
            Console.WriteLine($"ID: {record.id}, Price: {record.price}, Timestamp: {record.timestamp}");
        }

        await databaseService.EnsureTableExistsAsync();
        await databaseService.AddDataAsync(dataList);
        Console.WriteLine("Data successfully added to the database.");
    }
    else
    {
        Console.WriteLine("No data loaded.");
    }
}

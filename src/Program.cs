using assignment_wt2;
using Elasticsearch.Net;
using Microsoft.Extensions.DependencyInjection;
using Nest;
using Polly; 

DotNetEnv.Env.Load();
var connectionSettings = new ConnectionSettings(new Uri("http://elasticsearch:9200")) //TODO: Make it possible to use localhost in development
    .DisableDirectStreaming()
    .BasicAuthentication("elastic", Environment.GetEnvironmentVariable("ELASTIC_PASSWORD"))
    .ServerCertificateValidationCallback(CertificateValidations.AllowAll);

var retryPolicy = Polly.Policy
    .Handle<Exception>() 
    .WaitAndRetryAsync(10, retryAttempt => TimeSpan.FromSeconds(Math.Pow(10, retryAttempt)));


var elasticClient = await retryPolicy.ExecuteAsync(async () =>
{
    var client = new ElasticClient(connectionSettings);
    if (client.Ping().IsValid)
    {
        Console.WriteLine("Successfully connected to Elasticsearch.");
        return client;
    }
    else
    {
        Console.WriteLine("Failed to connect to Elasticsearch.");
        throw new Exception("Connection to Elasticsearch failed.");
    }
});


// Dependency Injection setup
var serviceProvider = new ServiceCollection()
    .AddSingleton<AddToElastic>()
    .AddSingleton<IElasticClient>(elasticClient)
    .BuildServiceProvider();

var addToElastic = serviceProvider.GetService<AddToElastic>();

var indexSetup = new ElasticIndexSetup(elasticClient);
await indexSetup.CreateIndexAsync();


var dataLoader = new DataLoader("src/NewYork.json");

List<Data> dataList = await dataLoader.LoadDataAsync();

if (dataList != null && dataList.Any())
{
    Console.WriteLine("Data loaded successfully. Printing first few records:");

    // Print first 5 records or the full list if there are less than 5
    var recordsToDisplay = dataList.Take(5);
    foreach (var record in recordsToDisplay)
    {
        Console.WriteLine($"ID: {record.id}, Price: {record.price}, Availability: {record.availability_365}, Timestamp: {record.timestamp}");
    }
}
else
{
    Console.WriteLine("No data loaded or data is empty.");
}
await addToElastic.AddData(dataList);
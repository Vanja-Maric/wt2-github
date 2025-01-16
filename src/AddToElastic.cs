using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nest;

namespace assignment_wt2
{
    public class AddToElastic
    {
        private readonly IElasticClient elasticClient;

        public AddToElastic(IElasticClient elasticClient)
        {
            this.elasticClient = elasticClient;
        }

        public async Task AddData(IEnumerable<Data> data)
        {
            var index = "air_bnb_new_york_city";
            var batchSize = 200;
            var shipped = 0;

            Console.WriteLine($"Starting to load data into index: {index}");

            while (data.Skip(shipped).Take(batchSize).Any())
            {
                var batch = data.Skip(shipped).Take(batchSize).ToList();

                // Log the number of items in the current batch being processed
                Console.WriteLine($"Processing batch {shipped / batchSize + 1} with {batch.Count} items.");

                var bulkIndexResponse = await elasticClient.BulkAsync(b => b
                    .Index(index)
                    .IndexMany(batch)
                );

                if (bulkIndexResponse.Errors)
                {
                    Console.WriteLine($"Batch {shipped / batchSize + 1} failed to index some documents.");
                    foreach (var item in bulkIndexResponse.ItemsWithErrors)
                    {
                        Console.WriteLine($"Failed to index document {item.Id}. Error: {item.Error.Reason}");
                    }
                }
                else
                {
                    // Log success for this batch
                    Console.WriteLine($"Successfully indexed batch {shipped / batchSize + 1}. {batch.Count} documents indexed.");
                }

                shipped += batchSize;
            }

            Console.WriteLine($"Finished loading data into index: {index}");
        }
    }
}

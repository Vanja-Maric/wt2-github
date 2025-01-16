using System;
using System.Threading.Tasks;
using Nest;

namespace assignment_wt2
{
    public class ElasticIndexSetup
    {
        private readonly IElasticClient elasticClient;

        public ElasticIndexSetup(IElasticClient elasticClient)
        {
            this.elasticClient = elasticClient;
        }

        public async Task CreateIndexAsync()
        {
            var indexName = "air_bnb_new_york_city";

            var createIndexResponse = await elasticClient.Indices.CreateAsync(indexName, c => c
                .Map<Data>(m => m
                    .AutoMap()
                    .Properties(ps => ps
                        .GeoPoint(g => g
                            .Name(n => n.location)
                        )
                    )
                )
                .Settings(s => s
                    .NumberOfShards(1)
                    .NumberOfReplicas(0)
                )
            );

            if (!createIndexResponse.IsValid)
            {
                Console.WriteLine($"Failed to create index '{indexName}'. Error: {createIndexResponse.ServerError}");
            }
            else
            {
                Console.WriteLine($"Index '{indexName}' created successfully.");
            }
        }

    }
}

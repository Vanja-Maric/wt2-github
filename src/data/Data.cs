using System;
using System.Text.Json.Serialization;
using assignment_wt2.src.data;
using Nest;

namespace assignment_wt2.src.data
{
    public class Data
    {
        [JsonPropertyName("id")]
        public int id { get; set; }

        [JsonPropertyName("name")]
        public string? name { get; set; }

        [JsonPropertyName("neighbourhood_group")]
        public string? neighbourhood_group { get; set; }

        [JsonPropertyName("neighbourhood")]
        public string? neighbourhood { get; set; }

        [JsonPropertyName("room_type")]
        public string? room_type { get; set; }

        [JsonPropertyName("price")]
        public int? price { get; set; }

        [JsonPropertyName("number_of_reviews")]
        public int? number_of_reviews { get; set; }

        public DateTime timestamp {get; internal set; }
    }

}

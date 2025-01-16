using System;
using System.Text.Json.Serialization;
using assignment_wt2.data;
using Nest;

namespace assignment_wt2
{
    public class Data
    {
        [JsonPropertyName("id")]
        public int id { get; set; }

        [JsonPropertyName("name")]
        public string name { get; set; }

        [JsonPropertyName("host_id")]
        public int host_id { get; set; }

        [JsonPropertyName("host_name")]
        public string host_name { get; set; }

        [JsonPropertyName("neighbourhood_group")]
        public string neighbourhood_group { get; set; }

        [JsonPropertyName("neighbourhood")]
        public string neighbourhood { get; set; }

        [JsonPropertyName("latitude")]
        public double latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double longitude { get; set; }

        [JsonPropertyName("location")]
        public GeoLocation location => new GeoLocation(latitude, longitude);


        [JsonPropertyName("room_type")]
        public string room_type { get; set; }

        [JsonPropertyName("price")]
        public int price { get; set; }

        [JsonPropertyName("minimum_nights")]
        public int minimum_nights { get; set; }

        [JsonPropertyName("number_of_reviews")]
        public int number_of_reviews { get; set; }


        [JsonPropertyName("availability_365")]
        public int availability_365 { get; set; }

        public DateTime timestamp {get; internal set; }
    }

}

using System;
using System.Text.Json.Serialization;

namespace assignment_wt2.data
{
public class GeoPoint
{
    [JsonPropertyName("lat")]
    public double Latitude { get; set; }

    [JsonPropertyName("lon")]
    public double Longitude { get; set; }

}
}

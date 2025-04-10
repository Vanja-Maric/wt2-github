using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;

namespace assignment_wt2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirbnbController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public AirbnbController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpGet("room-types")]
        public async Task<IActionResult> GetRoomTypeDistribution()
        {
            try
            {
                var data = await _databaseService.GetRoomTypeDistributionAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("average-price-by-room-type")]
        public async Task<IActionResult> GetAveragePriceByRoomType()
        {
            try
            {
                var data = await _databaseService.GetAveragePriceByRoomTypeAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("average-price-by-neighborhood")]
        public async Task<IActionResult> GetAveragePriceByNeighborhood()
        {
            try
            {
                var data = await _databaseService.GetAveragePriceByNeighborhoodAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("neighborhoods")]
        public async Task<IActionResult> GetNeighborhoods()
        {
            try
            {
                var data = await _databaseService.GetNeighborhoodsAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("price-distribution")]
        public async Task<IActionResult> GetPriceDistribution([FromQuery] string neighborhood, [FromQuery] string roomType)
        {
            if (string.IsNullOrWhiteSpace(neighborhood) || string.IsNullOrWhiteSpace(roomType))
            {
                return BadRequest("Both 'neighborhood' and 'roomType' are required.");
            }

            try
            {
                var data = await _databaseService.GetPriceDistributionAsync(neighborhood, roomType);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
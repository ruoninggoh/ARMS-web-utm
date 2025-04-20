using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

namespace ARMS_web_utm.Controllers
{
    [Route("api")]
    [ApiController]
    public class GenericController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public GenericController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _baseUrl = configuration["BaseUrl"] ?? throw new ArgumentNullException("BaseUrl is not configured in appsettings.json");
        }

        // Forward Authorization Header
        private void ForwardAuthorizationHeader(HttpRequestMessage requestMessage)
        {
            if (Request.Headers.TryGetValue("Authorization", out var authHeader) && !string.IsNullOrEmpty(authHeader))
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authHeader.ToString().Replace("Bearer ", ""));
            }
        }

        /*  // Dynamic GET method
          [HttpGet("{*path}")]
          public async Task<IActionResult> DynamicGet(string path, [FromQuery] Dictionary<string, string> queryParams)
          {
              var queryString = string.Join("&", queryParams.Select(q => $"{q.Key}={q.Value}"));
              var targetUrl = $"{_baseUrl}/{path}?{queryString}";

              try
              {
                  var request = new HttpRequestMessage(HttpMethod.Get, targetUrl);
                  ForwardAuthorizationHeader(request);

                  var response = await _httpClient.SendAsync(request);

                  if (response.IsSuccessStatusCode)
                  {
                      var result = await response.Content.ReadAsStringAsync();
                      return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                  }

                  return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
              }
              catch (Exception ex)
              {
                  return StatusCode(500, $"Error forwarding GET request: {ex.Message}");
              }
          }*/

        [HttpGet("{*path}")]
        public async Task<IActionResult> DynamicGet(string path, [FromQuery] Dictionary<string, string> queryParams)
        {
            var queryString = string.Join("&", queryParams.Select(q => $"{q.Key}={q.Value}"));
            var targetUrl = $"{_baseUrl}/{path}?{queryString}";

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, targetUrl);
                ForwardAuthorizationHeader(request);

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/json";

                    // If the content is a file, return as a stream
                    if (contentType.Contains("application/octet-stream") || contentType.Contains("image") || contentType.Contains("pdf"))
                    {
                        return new FileStreamResult(await response.Content.ReadAsStreamAsync(), contentType)
                        {
                            FileDownloadName = "downloadedFile"  // You can set a dynamic file name if needed
                        };
                    }

                    // Otherwise, return content as JSON or text
                    var result = await response.Content.ReadAsStringAsync();
                    return Content(result, contentType);
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding GET request: {ex.Message}");
            }
        }


        // Dynamic POST method
        /*        [HttpPost("{*path}")]
                public async Task<IActionResult> DynamicPost(string path, [FromBody] JsonElement requestBody)
                {
                    var targetUrl = $"{_baseUrl}/{path}";

                    try
                    {
                        var request = new HttpRequestMessage(HttpMethod.Post, targetUrl)
                        {
                            Content = new StringContent(requestBody.GetRawText(), Encoding.UTF8, "application/json")
                        };
                        ForwardAuthorizationHeader(request);

                        var response = await _httpClient.SendAsync(request);

                        if (response.IsSuccessStatusCode)
                        {
                            var result = await response.Content.ReadAsStringAsync();
                            return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                        }

                        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, $"Error forwarding POST request: {ex.Message}");
                    }
                }*/


        [HttpPost("{*path}")]
        public async Task<IActionResult> DynamicPost(string path)
        {
            var targetUrl = $"{_baseUrl}/{path}";

            try
            {
                // Check if this is a file upload request
                if (Request.HasFormContentType)
                {
                    // Handle as multipart form data
                    var formContent = new MultipartFormDataContent();

                    // Copy all form fields
                    foreach (var field in Request.Form)
                    {
                        if (Request.Form.Files.All(f => f.Name != field.Key))
                        {
                            formContent.Add(new StringContent(field.Value), field.Key);
                        }
                    }

                    // Copy all files
                    foreach (var file in Request.Form.Files)
                    {
                        var fileContent = new StreamContent(file.OpenReadStream());
                        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
                        formContent.Add(fileContent, file.Name, file.FileName);
                    }

                    var request = new HttpRequestMessage(HttpMethod.Post, targetUrl)
                    {
                        Content = formContent
                    };
                    ForwardAuthorizationHeader(request);

                    var response = await _httpClient.SendAsync(request);
                    return await HandleResponse(response);
                }
                else
                {
                    // Handle as JSON (original behavior)
                    using var reader = new StreamReader(Request.Body);
                    var requestBody = await reader.ReadToEndAsync();

                    var request = new HttpRequestMessage(HttpMethod.Post, targetUrl)
                    {
                        Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
                    };
                    ForwardAuthorizationHeader(request);

                    var response = await _httpClient.SendAsync(request);
                    return await HandleResponse(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding request: {ex.Message}");
            }
        }

        private async Task<IActionResult> HandleResponse(HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return Content(result, response.Content.Headers.ContentType?.ToString());
            }
            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }



        // Dynamic PUT method
        [HttpPut("{*path}")]
        public async Task<IActionResult> DynamicPut(string path, [FromBody] JsonElement requestBody)
        {
            var targetUrl = $"{_baseUrl}/{path}";

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Put, targetUrl)
                {
                    Content = new StringContent(requestBody.GetRawText(), Encoding.UTF8, "application/json")
                };
                ForwardAuthorizationHeader(request);

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding PUT request: {ex.Message}");
            }
        }

        // Dynamic DELETE method
        [HttpDelete("{*path}")]
        public async Task<IActionResult> DynamicDelete(string path, [FromQuery] Dictionary<string, string> queryParams)
        {
            var queryString = string.Join("&", queryParams.Select(q => $"{q.Key}={q.Value}"));
            var targetUrl = $"{_baseUrl}/{path}?{queryString}";

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Delete, targetUrl);
                ForwardAuthorizationHeader(request);

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding DELETE request: {ex.Message}");
            }
        }
    }
}

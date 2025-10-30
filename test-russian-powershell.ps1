# Test the Russian Story Generator API

$body = @{
    proficiency = "B1"
    theme = "дружба"
    wordCount = 150
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/generate-story" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Success! Story generated:"
    Write-Host "Title: $($response.title)"
    Write-Host "Story: $($response.story.Substring(0, [Math]::Min(200, $response.story.Length)))..."
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)"
}
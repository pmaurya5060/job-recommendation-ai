// Quick test script to check API response
// Run with: node test-api.js

const apiKey = process.env.JSEARCH_API_KEY || "ak_bg92jubuxerd229jrw52zbu5fgak7fhzecua12j2mot0q5x"
const query = "React developer jobs"
const url = `https://api.openwebninja.com/jsearch/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=in&language=en`

console.log("Testing API call...")
console.log("URL:", url)
console.log("API Key:", apiKey.substring(0, 10) + "...")

fetch(url, {
  headers: {
    "x-api-key": apiKey,
    "Accept": "*/*",
  },
})
  .then(async (response) => {
    console.log("\nResponse Status:", response.status)
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log("\nResponse Body:", text.substring(0, 1000))
    
    try {
      const json = JSON.parse(text)
      console.log("\nParsed JSON keys:", Object.keys(json))
      console.log("Full JSON:", JSON.stringify(json, null, 2).substring(0, 2000))
    } catch (e) {
      console.log("Not valid JSON")
    }
  })
  .catch((error) => {
    console.error("Error:", error)
  })


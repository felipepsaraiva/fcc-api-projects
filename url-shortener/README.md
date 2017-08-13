# URL Shortener Microservice

FreeCodeCamp provides a number of challenges for people to learn web development. This is the solutions I developed for the Url Shortener Microservice challenge to learn Back End Development with NodeJS. Here I have all projects implemented in the same server, so it's easier to maintain.

Live: <https://fcc-api-project.glitch.me/url-shortener>

### Creating a Shortened URL

You can create a new shortened url by requesting it through the `/new` endpoint, as the example:  
`https://fcc-api-project.glitch.me/url-shortener/new/https://google.com/`

The url will be validaded and the short version will be created. A JSON will be returned with both the original and the short url, as the example:  
`{ "short_url":"https://fcc-api-project.glitch.me/url-shortener/5990c2d83c668c18397d51c2", "original_url":"https://google.com/" }`

# URL Shortener Microservice

Live: <https://fcc-api-project.glitch.me/url-shortener>

### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{ "error": "Invalid URL" }`.
3. When I visit the shortened URL, it will redirect me to my original link.


### Creation example:

* POST https://fcc-api-project.glitch.me/api/shorturl/new - body (urlencoded): `url=https://www.google.com`
* GET <https://fcc-api-project.glitch.me/api/shorturl/new/https://www.google.com>

#### Example output:

```
{
  "short_url": "https://fcc-api-project.glitch.me/api/shorturl/2zEjBV",
  "original_url": "https://www.google.com"
}
```

### Usage:

Visiting the shortened url (<https://fcc-api-project.glitch.me/api/shorturl/2zEjBV>) will redirect to the original url (<https://www.google.com>).

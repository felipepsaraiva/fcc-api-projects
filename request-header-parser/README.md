# Request Header Parser Microservice

Live: <https://fcc-api-project.glitch.me/request-header-parser>

### User stories:

1. I can get the IP address, preferred languages (from header `Accept-Language`) and system infos (from header `User-Agent`) for my device.

#### Example usage:

* <https://fcc-api-project.glitch.me/api/whoami>

#### Example output:

```
{
  "ipaddress":"159.20.14.100",
  "language":"en-US,en;q=0.5",
  "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"
}
```

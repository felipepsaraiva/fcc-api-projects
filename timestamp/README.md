# Timestamp Microservice

FreeCodeCamp provides a number of challenges for people to learn web development. This is the solutions I developed for the Timestamp Microservice challenge to learn Back End Development with NodeJS. Here I have all projects implemented in the same server, so it's easier to maintain.

Live: <https://fcc-api-project.glitch.me/timestamp>


### API

**Parameter:** A date written on natural language (January 16, 2017) or a unix timestamp.

**Response:** A JSON string containing both the unix timestamp and the natural language form of the date provided.


### Example

**Request:**  
<https://fcc-api-project.glitch.me/timestamp/January%2016,%202017>  
<https://fcc-api-project.glitch.me/timestamp/1484532000000>

**Response:**  
`{"natural":"January 16, 2017","unix":1484532000000}`

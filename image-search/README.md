# Image Search Abstraction Layer

FreeCodeCamp provides a number of challenges for people to learn web development. This is the solution I developed for the Image Search Abstraction Layer challenge to learn Back End Development with NodeJS. Here I have all API projects implemented in the same server, so it's easier to maintain.

Live: <https://fcc-api-project.glitch.me/image-search>

### Searching Images

You can search images related to a given string using `/search/{{string}}`:  
<https://fcc-api-project.glitch.me/image-search/search/dogs>


**Response Example:** `[{"url":"https://i.imgur.com/G9Yidig.jpg","altText":"My awesome gift from my secret santa","page":"https://imgur.com/a/ANDap"}, ...]`

### Latest Search Queries

You can view the latest search queries from <https://fcc-api-project.glitch.me/image-search/latest>. It will be returned a JSON string with the strings searched and the timestamp of when they were searched.

`[{"term":"santa","when":1513708651202}, ...]`

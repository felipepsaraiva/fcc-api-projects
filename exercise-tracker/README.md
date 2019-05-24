# Exercise Tracker Microservice

Live: <https://fcc-api-project.glitch.me/exercise-tracker>

### User Stories

1. I can create a user by posting form data username to `/api/exercise/new-user` and returned will be an object with `username` and `id`.
2. I can get an array of all users by getting `/api/exercise/users` with the same info as when creating a user.
3. I can add an exercise to any user by posting form data `userId`, `description`, `duration`, and optionally `date` to `/api/exercise/add`. If no date supplied it will use current date. Returned will be the user object with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting `/api/exercise/log` with a parameter of userId. Returned will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of `from` and `to`, or `limit` (Date format is yyyy-mm-dd and limit is an integer).

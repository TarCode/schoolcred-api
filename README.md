# SchoolCred API

[![Build Status](https://travis-ci.org/TarCode/schoolcred-api.png?branch=master)](https://travis-ci.org/TarCode/schoolcred-api)
[![Coverage Status](https://coveralls.io/repos/github/TarCode/schoolcred-api/badge.png?branch=master)](https://coveralls.io/github/TarCode/schoolcred-api?branch=master)

API for SchoolCred app

## Endpoints
These are the available endpoints for the API:

## Unprotected 
Signup and signin are the only unprotected routes
### POST

- `/signup`: Creates a new user account. Requires `email`, `username`,`password` and `passwordConf` 

- `/signin`: Signs a user in. Requires `email` and `password`
## Protected
All protected endpoints need an authorization token which is received when signing up or signing in:
### GET
- `/profile`: Returns the user profile 

- `/item`: Returns a list of items

- `/item/:id`: Returns an item by id

- `/deposit/:userId`: Returns a list of the users deposit history

- `/credit/:userId`: Returns the users current balance

### POST

- `/deposit/:userId`: Deposits credits into the users account. Requires the `amount`.

- `/item`: Adds an item. Requires the item `name` and `userId`

### PUT

- `/item/:id`: Updates and item's name. Requires `name` and `userId`


### DELETE

- `/item/:id`: Deletes an item


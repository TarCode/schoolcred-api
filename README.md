# SchoolCred API

[![Build Status](https://travis-ci.org/TarCode/schoolcred-api.svg?branch=master)](https://travis-ci.org/TarCode/schoolcred-api)
[![Coverage Status](https://coveralls.io/repos/github/TarCode/schoolcred-api/badge.svg?branch=master)](https://coveralls.io/github/TarCode/schoolcred-api?branch=master)

API for SchoolCred app

## Endpoints
These are the available endpoints for the API:
### Protected
All protected endpoints need an authorization token which is received when signing up or signing in:
### GET
- `/profile`: Returns the user profile 

- `/item`: Returns a list of items

- `/item/:id`: Returns an item by id

- `/deposit/:userId`: Returns a list of the users deposit history

- `/credit/:userId`: Returns the users current balance


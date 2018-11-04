# Car Show Ballot Box API

My dad helps run a car show and he counts the ballots. It is a painful process. The purpose of this API and the app that uses it is to make his life easier by allowing a person to input the votes and each ballot. The app will then determine the top three vote getters for each car class.

## Developing

1. clone the repo
1. `npm i`
1. create a database and use `scripts/install.sql` to create the tables in it
1. create a second unit testing database and use `scripts/install.sql` to create the tables in it
1. set CAR_SHOW_TEST_DB_URL environment variable (example: `export CAR_SHOW_TEST_DB_URL=postgres://ken:ken@localhost/testcarshowballotbox`)
1. `npm test` (or `npm test -- --watch`)
1. `heroku local web` to create a dev server

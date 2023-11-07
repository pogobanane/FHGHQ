
## Development Cycle

1. delete database `rm .data/global-data.db`
2. comment all lines except table creations in `onetimers.js` and run via `node onetimers.js`
3. comment all lines except wrapapi related ones and run `npm run server` (which will call `onetimers.js` again)
4. start webpack server `npm run build`
5. start nginx `nginx -p $(pwd) -c ./nginx.conf`

## Env Vars

The following env vars contain (important) configuration:

For the steam login you need to specify:

 - `LINK`: URL to this website ending on `/`
 - `KEY`: steam API key (get from [steamcommunity.com/dev/apikey](http://steamcommunity.com/dev/apikey))

Detailed docs for that are at [passportjs.org passport-steam](https://www.passportjs.org/packages/passport-steam/).

There is also some discord bot which takes a token:

 - `DISCORD_TOKEN`: some token

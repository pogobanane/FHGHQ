# Foxhole Global V2.1

The project is currently in a complete disarray, unmaintained and deprecated. Some people still use it.
_________

## Build

You can set environment variables by creating `./mysecretenv` as environmentfile. Example: 

```
KEY=90XXXXXXXXXREDACTEDXXXXXXXXXXX47
LINK=https://example.com:3000/
```

For the steam login you need to specify:

 - `LINK`: URL to this website ending on `/`
 - `KEY`: steam API key (get from [steamcommunity.com/dev/apikey](http://steamcommunity.com/dev/apikey))

Detailed docs for that are at [passportjs.org passport-steam](https://www.passportjs.org/packages/passport-steam/).

There is also some discord bot which takes some `DISCORD_TOKEN`.

Run the server with `docker-compose up`. It...

- mounts the `./.data` folder to save the database at
- exposes the service on port `1337`


## Shortcuts

[MAP LIST](https://war-service-live.foxholeservices.com/api/worldconquest/maps/) https://war-service-live.foxholeservices.com/api/worldconquest/maps/

[WAR INFO](https://war-service-live.foxholeservices.com/api/worldconquest/war) https://war-service-live.foxholeservices.com/api/worldconquest/war

[DYNAMIC](https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/dynamic/public) https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/dynamic/public

[STATIC](https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/static) https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/static

[WAR REPORT](https://war-service-live.foxholeservices.com/api/worldconquest/warReport/DeadLandsHex) https://war-service-live.foxholeservices.com/api/worldconquest/warReport/DeadLandsHex

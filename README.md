# Foxhole Global V2.1

The project is currently in a complete disarray, unmaintained and deprecated. Some people still use it.
_________

## Develop

- Build a docker image: `docker build -t oldhq .`
- Run the image: `docker run -ti --init oldhq`

## Production

Set environment variables i.e. by creating `./mysecretenv` as environmentfile containing:

```
KEY=90XXXXXXXXXREDACTEDXXXXXXXXXXX47
LINK=https://example.com:3000/
```

And don't forget to mount a `.data` folder to make the database persistent across restarts. 

Example command: `docker run -ti --init -v ./.data:/usr/src/app/.data -p 3000:3000 -e 3000 --env-file=mysecretenv oldhq`

## Shortcuts

[MAP LIST](https://war-service-live.foxholeservices.com/api/worldconquest/maps/) https://war-service-live.foxholeservices.com/api/worldconquest/maps/

[WAR INFO](https://war-service-live.foxholeservices.com/api/worldconquest/war) https://war-service-live.foxholeservices.com/api/worldconquest/war

[DYNAMIC](https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/dynamic/public) https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/dynamic/public

[STATIC](https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/static) https://war-service-live.foxholeservices.com/api/worldconquest/maps/DeadLandsHex/static

[WAR REPORT](https://war-service-live.foxholeservices.com/api/worldconquest/warReport/DeadLandsHex) https://war-service-live.foxholeservices.com/api/worldconquest/warReport/DeadLandsHex

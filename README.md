#jPeople

jPeople currently only works if OpenJUB runs on localhost:6969. jPeople is still in development and not finished yet!

To run:
```
npm install
bower install
grunt serve
```

If you are using other domains, do not forget to change app/scripts/services/openjub.js settings.

## Deployment

```
npm install
bower install
grunt build
```

Then point your webserver to serve the ```dist/``` directory and fallback (for 404s) to ```index.html```. 

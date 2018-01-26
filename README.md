# technical-review
Sample CRUD APP for technical review

Clone this repo then:
```
npm install
```

You may want to change the port the server will be listening on for local development.

./server/server.js
```
app.listen(80, function() {
  console.log('Server is listening on port 80');
});
```

some required global packages:
```
npm install -g pm2 gulp-cli webpack-cli
```

start the server w/ watch:
```
pm2 start pm2.json
```
this will start the server and watch server.js for changes.

I always like to have gulp running in a separate background console:
```
npm run gulp
```
this will watch app.scss for changes

And finally build the bundle w/ webpack:
```
npm run task
```
I like control over when webpack compiles, so I run this manually when needed.
It would be trivial to setup a watcher for this task.

Demo of this app is running [here](https://suprsidr.com).


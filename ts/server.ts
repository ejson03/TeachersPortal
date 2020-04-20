import * as config from './config/server'
import {app} from "./app";

app.listen('https://teachers-portal.herokuapp.com');

process.on("SIGINT", function() {
  console.log("App Shutting Down");
});


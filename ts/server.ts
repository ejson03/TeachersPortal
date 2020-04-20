import * as config from './config/server'
import {app} from "./app";

app.listen('https://teachers-portal.herokuapp.com', () => {
  console.log("Default Login Screen", config.Server.Name + ':' + config.Server.Port);
});

process.on("SIGINT", function() {
  console.log("App Shutting Down");
});


import * as config from './config/server'
import {app} from "./app";

app.listen(8000, () => {
  console.log("Server is started......")
});

process.on("SIGINT", function() {
  console.log("App Shutting Down");
});


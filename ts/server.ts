require('dotenv').config()
import {app} from "./app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

process.on("SIGINT", function() {
  console.log("App Shutting Down");
});


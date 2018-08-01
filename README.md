# bamazon-app
Node-based app for storefront and inventory tracking.
## Configuration
This app requires a config.js file in order to be configured to communicate with the user's database.
* In the bamazon[customer/supervisor/etc].js file, "require" your config.js file, set as value of the variable "config".
* create a "config.js file" along the following lines:
        
        var mysql = require("mysql");

        var connection = mysql.createConnection({
            host: "localhost",
            port: YOUR_PORT,
            user: "USERNAME",
            password: "YOUR_PASSWORD",
            database: "bamazon"
          });

        module.exports = connection;

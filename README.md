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
        
## Sandboxing
If you would like to test the bamazon application, you can use the "test_db_generator.sql" script in your mysql workspace to generate a database with the appropriate table structure.  Be sure to reflect database name, host path, port and password information in your config.js file.

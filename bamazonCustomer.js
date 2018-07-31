var mysql = require("mysql");
var inquirer = require("inquirer");
var catalog = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  

  connection.connect(function(err) {
    if (err) throw err;
    getProducts();
  });

  function getProducts(){
    connection.query("SELECT * FROM products", function(err, res){
      if (err) throw err;
      
      res.forEach(pass => catalog.push(pass.item_name));
      console.log(`-------------------`);
      console.log(`Welcome to Bamazon!`);
      console.log(`-------------------`);

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            message: "What product are you interested in today?",
            pageSize: catalog.length,
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].product_name);
              }
              return choiceArray;
            }
          }
        ]);
    });
  };
   
    
  


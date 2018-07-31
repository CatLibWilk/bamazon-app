var mysql = require("mysql");
var inquirer = require("inquirer");

var catIndex = [];
var selectedItem = 0;

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

      console.log(`-------------------`);
      console.log(`Welcome to Bamazon!`);
      console.log(`-------------------`);
      console.log(`Our Products:`);

      res.forEach(pass => console.log(`${pass.item_id} - ${pass.product_name}`));
      res.forEach(pass => catIndex.push(pass.product_name));
      


      inquirer
        .prompt([
          {
            name: "choice",
            type: "input",
            message: "What product are you interested in today (Please input item ID)?"
          }
        ]).then(function(response){
          selectedItem = response.choice;
          var respIndex = parseInt(response.choice-1);
          inquirer
            .prompt([
              {
              name: "amount",
              type: "input",
              message: `You've selected for purchase ${catIndex[respIndex]}, how many units would you like to purchase?`
              }
            ]).then(function(response){
              connection.query("SELECT stock_quantity FROM products WHERE ?",
              {
                item_id: selectedItem
              },
              function(err, res){
                if (err) throw err;
                var returnedStock = res[0].stock_quantity;
                
                if(parseInt(response.amount) > parseInt(returnedStock)){
                  console.log(`Sorry, we currently dont have enough ${catIndex[selectedItem-1]} in stock to fill your order, please select another quantity, or another item from our store.`);
                  setTimeout(getProducts, 2000);
                }else{
                  
                }
              }
            );
            });
        });
    });
  };
   
    
  


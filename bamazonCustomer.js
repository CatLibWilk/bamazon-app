var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./config.js");

var catIndex = [];
var selectedItem = 0;
var selectedAmount = 0;
var returnedStock = 0;

var connection = config;
  

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

      res.forEach(pass => console.log(`${pass.item_id} - ${pass.product_name}: $${pass.price} - Available: ${pass.stock_quantity}`));
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
          connection.query("SELECT * FROM products WHERE ?",
            {
              item_id: response.choice
            },
            function(err, res2){
              if (err) throw err;
        
          inquirer
            .prompt([
              {
              name: "amount",
              type: "input",
              message: `You've selected for purchase ${res2[0].product_name}, how many units would you like to purchase?`
              }
            ]).then(function(response){
              connection.query("SELECT stock_quantity, product_name FROM products WHERE ?",
              {
                item_id: selectedItem
              },
              function(err, res2){
                if (err) throw err;
                returnedStock = res2[0].stock_quantity;
                selectedAmount = parseInt(response.amount);
                
                if(parseInt(response.amount) > parseInt(returnedStock)){
                  console.log(`Sorry, we currently dont have enough ${res2[0].product_name} in stock to fill your order, please select another quantity, or another item from our store.`);
                  setTimeout(getProducts, 2000);
                }else{
                  console.log(`Great! Please wait while we process your order for ${response.amount} order(s) of ${res2[0].product_name}`);
                  setTimeout(placeOrder, 2000);
                }
              }
            );

            });
          });
        });///then function and select * from ~ line 38
    });
  };
   
  function placeOrder(){
    var updatedStock = returnedStock-selectedAmount;
    connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: updatedStock
      },
      {
        item_id: selectedItem
      }
    ],
    function(err, res){
      if (err) throw err;
      console.log(`Your order has been placed, generating payment information...`);
      setTimeout(billGen, 2000);
    });
  };

  function billGen(){
    connection.query("SELECT price, product_name FROM products WHERE ?",
    {
      item_id: selectedItem
    },
    function(err, res3){
      if (err) throw err;
      var itemPrice = res3[0].price;
      var bill = itemPrice * selectedAmount;

      console.log(`Total payment due for ${selectedAmount} order(s) of ${res3[0].product_name}: $${bill}`);
      repeat();
    }
  )
  };

  function repeat(){
    inquirer
      .prompt([
        {
          name: "repeat",
          type: "list",
          message: "Would you like to make another purchase?",
          choices: ["Yes, take me to the main menu", "No"]
        }
      ]).then(function(response){
        console.log(response.repeat);
        if(response.repeat === "No"){
          connection.end();
        }else{
          getProducts();
        }
      });
  }
    
  


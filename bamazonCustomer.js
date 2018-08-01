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
                returnedStock = res[0].stock_quantity;
                selectedAmount = parseInt(response.amount);
                
                if(parseInt(response.amount) > parseInt(returnedStock)){
                  console.log(`Sorry, we currently dont have enough ${catIndex[selectedItem-1]} in stock to fill your order, please select another quantity, or another item from our store.`);
                  setTimeout(getProducts, 2000);
                }else{
                  console.log(`Great! Please wait while we process your order for ${response.amount} order(s) of ${catIndex[selectedItem-1]}`);
                  setTimeout(placeOrder, 2000);
                }
              }
            );

            });
        });
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
    connection.query("SELECT price FROM products WHERE ?",
    {
      item_id: selectedItem
    },
    function(err, res){
      if (err) throw err;
      var itemPrice = res[0].price;
      var bill = itemPrice * selectedAmount;

      console.log(`Total payment due for ${selectedAmount} order(s) of ${catIndex[selectedItem-1]}: $${bill}`);
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
    
  


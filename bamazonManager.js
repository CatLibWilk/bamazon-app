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
    initialize();
  });

  function initialize(){
      console.log(`Welcome to the Bamazon Manager Portal`);
      console.log(`-------------------------------------`);
      inquirer.prompt([
          {
              name: "input",
              type:"list",
              message: "What operation would you like to run?",
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
          }
      ]).then(function(response){
        switch(response.input){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            default: initialize();
        }
      });
  };


function viewProducts(){
    connection.query("SELECT * FROM products WHERE stock_quantity > 0 ORDER BY department_name", function(err, res){
        if (err) throw err;
        console.log(`Products Currently In-Stock`);
        console.log(`---------------------------`);
        res.forEach(pass => console.log(`Product #${pass.item_id}: ${pass.product_name}, $${pass.price} - amt in stock: ${pass.stock_quantity} --- Department: ${pass.department_name}`));
    });
}
function lowInventory(){
  console.log(`running low`);
}
function addInventory(){
  console.log(`running inventoryadd`);
}
function newProduct(){
  console.log(`running product add`);
}
var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./config.js");

var catIndex = [];
var updateId = 0;
var updateItemName = "";
var updateItemCurrentStock = 0;

var productAddName = "";

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
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit manager portal"]
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
            case "Exit manager portal":
                connection.end()
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
    
        inquirer   
            .prompt([{
                name: "continue",
                type: "list",
                message: "Return to main menu?",
                choices: ["Yes", "No, exit manager portal"]
            }]).then(function(response){
                if(response.continue === "Yes"){
                    initialize();
                }else{
                    connection.end();
                }
            });
    });
}
function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 10 ORDER BY department_name", function(err, res){
        if (err) throw err;
        console.log(`Products currently stocked at low level (Less than 10 units in stock)`);
        console.log(`---------------------------`);
        res.forEach(pass => console.log(`Product #${pass.item_id}: ${pass.product_name} - amt in stock: ${pass.stock_quantity} --- Department: ${pass.department_name}`));
        inquirer   
            .prompt([{
                name: "continue",
                type: "list",
                message: "Return to main menu?",
                choices: ["Yes", "No, exit manager portal"]
            }]).then(function(response){
                if(response.continue === "Yes"){
                    initialize();
                }else{
                    connection.end();
                }
            });
    });
}
function addInventory(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
  
        console.log(`All Products:`);
        console.log(`-------------------`);
  
        res.forEach(pass => console.log(`${pass.item_id} - ${pass.product_name}: $${pass.price} - Available: ${pass.stock_quantity}`));
        res.forEach(pass => catIndex.push(pass.product_name));
        inquirer
            .prompt([
                {
                    name: "select",
                    type: "input",
                    message: "Select Product ID for item you wish to perform stock update function on: ",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                }
            ]).then(function(response){
                connection.query(`SELECT * FROM products WHERE item_id=${response.select}`, function(err, res4){
                    if(err) throw err;

                console.log(`You've selected ${res4[0].product_name} to update`);
                updateId = res4[0].item_id;
                updateItemName = res4[0].product_name;
                updateItemCurrentStock = res4[0].stock_quantity;
                
                inquirer
                    .prompt([
                        {
                            name: "amount",
                            type: "input",
                            message: "How many units would you like to add/remove to/from the stock?: ",
                            validate: function(value){
                                if(isNaN(value) === false){
                                    return true;
                                }
                                return false;
                            }
                        }
                    ]).then(function(response){
                        console.log(`Please wait while the system adds/removes ${response.amount} unit(s) to the stock for ${updateItemName}...`);
                        connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updateItemCurrentStock + parseInt(response.amount)
                            },
                            {
                                item_id: updateId
                            }
                        ]
                    , function(err, res){
                        if (err) throw err;
                        connection.query("SELECT product_name, stock_quantity FROM products WHERE ?",
                            {
                                item_id: updateId
                            },
                            function(err, res){
                                if (err) throw err;
                                console.log(`Action complete. Stock quantity of ${res[0].product_name} is now ${res[0].stock_quantity} units(s).`);
                                inquirer   
                                    .prompt([
                                        {
                                            name: "nextAction",
                                            type: "list",
                                            message: "What would you like to do next?",
                                            choices: ["Update another product", "Return to main menu", "Exit manager portal"]
                                        }
                                    ]).then(function(response){
                                        switch(response.nextAction){
                                            case "Update another product":
                                                addInventory()
                                                break;
                                            case "Return to main menu":
                                                initialize()
                                                break;
                                            case "Exit manager portal":
                                                connection.end()
                                                break;
                                            default: initialize();
                                        };
                                    });
                            }
                        )
                    });
                    });
                });
            });
    })//connection query end
};
function newProduct(){
    inquirer
        .prompt([
            {
                name: "product",
                input: "input",
                message: "what is the name of the product to be added?",
            }
        ]).then(function(response){
            connection.query("SELECT product_name FROM products WHERE ?",
                {
                    product_name: response.product
                },
                function(err, res){
                    if (err) throw err;
                    if(res.length>0){
                        console.log(`Sorry, ${res[0].product_name} is already in the inventory. Please choose a unique name, or update the stock of the existing inventory item.`)
                        newProduct();
                    }else{
                        productAddName = response.product;
                        addUniqueProduct();
                    };
                }
            )
        }); //then function for name check end
    function addUniqueProduct(){
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "input",
                    message: "What department should this product be listed under?: "
                },
                {
                    name: "price",
                    type: "input",
                    message: "What is the price of this product?: "
                },
                {
                    name: "stock",
                    type: "input",
                    message: "How many units of this product are in stock?: "
                }
            ]).then(function(response){
                connection.query("INSERT INTO products SET ?",
                    {
                        product_name: productAddName,
                        department_name: response.department, 
                        price: response.price, 
                        stock_quantity: response.stock
                    },
                    function(err, res){
                        if (err) throw err;
                        connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res){
                            if (err) throw err;
                            console.log(`Updated current stock`);
                            console.log(`---------------------`);
                            res.forEach(pass => console.log(`Product #: ${pass.item_id} - ${pass.product_name} -- Price: $${pass.price} --- in-stock amount: ${pass.stock_quantity} || Department: ${pass.department_name}`));
                            inquirer    
                                .prompt([
                                    {
                                        name: "continue",
                                        type: "list",
                                        message: "What action would you like to take next?",
                                        choices: ["Add another product", "Return to main menu", "Exit manager portal"]
                                    }
                                ]).then(function(response){
                                    switch(response.continue){
                                        case "Add another product":
                                            newProduct()
                                            break;
                                        case "Return to main menu":
                                            initialize()
                                            break;
                                        case "Exit manager portal":
                                            connection.end()
                                            break;
                                        default:
                                            initialize();
                                    }
                                });
                        });
                    }
                );
            });
    };
};
CREATE DATABASE bamazon;

CREATE TABLE products(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price INTEGER(11) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL,
    PRIMARY KEY (item_id)
)

/////
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plastic Apple", "Fake Food", 5, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Metal Banana", "Fake Food", 10, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Racecar Bed", "Furniture", 200, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Two-Legged Chair", "Furniture", 50, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cool Stool", "Furniture", 25, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Vannevar Bush - Party Boutique (Deluxe CD)", "Music", 12, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Booze Money - Celebration Dad (Double LP)", "Music", 25, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wacky Pants", "Clownswear", 35, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rainbow Wig", "Clownswear", 10, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oversized Boxers (Heart-Pattern / 3-Pack", "Clown Intimates", 15, 15);

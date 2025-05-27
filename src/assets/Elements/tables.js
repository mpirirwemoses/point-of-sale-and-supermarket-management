// create-tables.js
const db = require("./db");

const createTables = () => {
  const queries = [

    `CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'cashier', 'manager') DEFAULT 'cashier',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS Categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS Products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category_id INT,
      price DECIMAL(10,2) NOT NULL,
      barcode VARCHAR(50) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories(id)
    );`,

    `CREATE TABLE IF NOT EXISTS Inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      quantity INT DEFAULT 0,
      low_stock_threshold INT DEFAULT 10,
      FOREIGN KEY (product_id) REFERENCES Products(id)
    );`,

    `CREATE TABLE IF NOT EXISTS Customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      phone VARCHAR(20),
      loyalty_points INT DEFAULT 0
    );`,

    `CREATE TABLE IF NOT EXISTS Sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      customer_id INT,
      total_amount DECIMAL(10,2),
      payment_method ENUM('cash', 'card', 'mobile_money') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (customer_id) REFERENCES Customers(id)
    );`,

    `CREATE TABLE IF NOT EXISTS SaleItems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sale_id INT,
      product_id INT,
      quantity INT,
      unit_price DECIMAL(10,2),
      FOREIGN KEY (sale_id) REFERENCES Sales(id),
      FOREIGN KEY (product_id) REFERENCES Products(id)
    );`,

    `CREATE TABLE IF NOT EXISTS Expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      description VARCHAR(255),
      amount DECIMAL(10,2),
      recorded_by INT,
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recorded_by) REFERENCES Users(id)
    );`,

    `CREATE TABLE IF NOT EXISTS Suppliers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100)
    );`,

    `CREATE TABLE IF NOT EXISTS Orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supplier_id INT,
      order_date DATE,
      status ENUM('pending', 'received') DEFAULT 'pending',
      FOREIGN KEY (supplier_id) REFERENCES Suppliers(id)
    );`,

    `CREATE TABLE IF NOT EXISTS OrderItems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      quantity INT,
      cost_price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES Orders(id),
      FOREIGN KEY (product_id) REFERENCES Products(id)
    );`

  ];

  queries.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) throw err;
    });
  });

  console.log("All tables created successfully.");
};

createTables();

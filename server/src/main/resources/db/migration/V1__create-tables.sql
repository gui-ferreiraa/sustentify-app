CREATE TABLE IF NOT EXISTS companies (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       cnpj VARCHAR(20) NOT NULL,
       address VARCHAR(255) NOT NULL,
       company_department VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS companies_deleted (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    company_department ENUM('ADMINISTRATIVE', 'SALES', 'FINANCE', 'HR', 'MARKETING', 'IT', 'PRODUCTION', 'LEGAL', 'SUPPORT', 'LOGISTICS', 'SUSTAINABILITY') NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      category ENUM('ELECTRONIC', 'PLASTIC', 'METAL', 'TEXTILE', 'WOOD', 'GLASS', 'FOOD', 'CHEMICAL') NOT NULL,
      description TEXT NOT NULL,
      product_condition ENUM('NEW', 'USED', 'REFURBISHED', 'DAMAGED', 'EXPIRED', 'AVAILABLE') NOT NULL,
      material ENUM('PLASTIC', 'METAL', 'WOOD', 'GLASS', 'PAPER', 'RUBBER', 'FABRIC', 'CERAMIC', 'OTHER') NOT NULL,
      production_date TIMESTAMP NOT NULL,
      disposal_date TIMESTAMP NOT NULL,
      price DECIMAL(10,2) NOT NULL CHECK (price > 0),
      location VARCHAR(255) NOT NULL,
      quantity INT NOT NULL CHECK (quantity >= 1),
      companies_id BIGINT,
      FOREIGN KEY (companies_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS interested_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    companies_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companies_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


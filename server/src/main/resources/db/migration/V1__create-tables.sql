CREATE TABLE IF NOT EXISTS companies (
       id VARCHAR(36) PRIMARY KEY NOT NULL,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       cnpj VARCHAR(20) UNIQUE NOT NULL,
       address VARCHAR(255) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       validation VARCHAR(30) NOT NULL,
       company_department ENUM('ADMINISTRATIVE', 'SALES', 'FINANCE', 'HR', 'MARKETING', 'IT', 'PRODUCTION', 'LEGAL', 'SUPPORT', 'LOGISTICS', 'SUSTAINABILITY') NOT NULL
);

CREATE TABLE IF NOT EXISTS companies_deleted (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_department ENUM('ADMINISTRATIVE', 'SALES', 'FINANCE', 'HR', 'MARKETING', 'IT', 'PRODUCTION', 'LEGAL', 'SUPPORT', 'LOGISTICS', 'SUSTAINABILITY') NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY NOT NULL,
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
      companies_id VARCHAR(36),
      FOREIGN KEY (companies_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS products_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    public_id VARCHAR(255),
    url VARCHAR(255),
    product_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS products_thumbnail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    public_id VARCHAR(255),
    url VARCHAR(255),
    product_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS company_document_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    public_id VARCHAR(255),
    url VARCHAR(255),
    company_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS interested_products (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    companies_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    message VARCHAR(250),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companies_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

ALTER TABLE companies CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE interested_products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE companies_deleted CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

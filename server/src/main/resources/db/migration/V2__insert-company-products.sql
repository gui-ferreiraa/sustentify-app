-- Inserir uma empresa
INSERT INTO companies (name, email, password, cnpj, address, company_department)
VALUES ('MataSelva Solutions', 'contato@mataselva.com', '123', '12.345.678/0001-99', 'Rua Verde, 123, São Paulo, SP', 'SALES');

-- Capturar o ID da empresa recém-criada
SET @company_id = LAST_INSERT_ID();

-- Inserir pelo menos 10 produtos associados à empresa
INSERT INTO products (name, category, description, product_condition, material, production_date, disposal_date, price, location, quantity, companies_id) VALUES
     ('Monitor LED', 'ELECTRONIC', 'Monitor LED 24 polegadas com leve arranhão.', 'USED', 'PLASTIC', '2023-01-15 12:00:00', '2025-06-30 12:00:00', 200.00, 'São Paulo, SP', 5, @company_id),
     ('Teclado Mecânico', 'ELECTRONIC', 'Teclado mecânico RGB, funcionamento perfeito.', 'USED', 'PLASTIC', '2022-11-10 12:00:00', '2025-12-31 12:00:00', 150.00, 'São Paulo, SP', 10, @company_id),
     ('Garrafa PET Reciclada', 'PLASTIC', 'Garrafa PET 2L reciclada.', 'AVAILABLE', 'PLASTIC', '2024-02-01 12:00:00', '2026-02-01 12:00:00', 1.50, 'São Paulo, SP', 500, @company_id),
     ('Sucata de Alumínio', 'METAL', 'Alumínio prensado para reciclagem.', 'AVAILABLE', 'METAL', '2023-06-20 12:00:00', '2026-06-20 12:00:00', 5.00, 'São Paulo, SP', 100, @company_id),
     ('Tecido de Algodão', 'TEXTILE', 'Retalhos de algodão colorido.', 'NEW', 'FABRIC', '2024-03-10 12:00:00', '2026-03-10 12:00:00', 12.00, 'São Paulo, SP', 50, @company_id),
     ('Paletes de Madeira', 'WOOD', 'Paletes de madeira usados para transporte.', 'USED', 'WOOD', '2022-07-15 12:00:00', '2025-07-15 12:00:00', 40.00, 'São Paulo, SP', 30, @company_id),
     ('Garrafas de Vidro', 'GLASS', 'Garrafas de vidro de 1L recicláveis.', 'AVAILABLE', 'GLASS', '2023-08-05 12:00:00', '2026-08-05 12:00:00', 2.00, 'São Paulo, SP', 200, @company_id),
     ('Papelão Prensado', 'WOOD', 'Fardos de papelão prensado para reciclagem.', 'AVAILABLE', 'PAPER', '2023-10-01 12:00:00', '2026-10-01 12:00:00', 10.00, 'São Paulo, SP', 80, @company_id),
     ('Óleo de Cozinha Usado', 'FOOD', 'Óleo vegetal usado para reciclagem.', 'USED', 'OTHER', '2023-12-01 12:00:00', '2025-12-01 12:00:00', 3.50, 'São Paulo, SP', 150, @company_id),
     ('Borracha Reciclada', 'PLASTIC', 'Pneus triturados para reuso.', 'REFURBISHED', 'RUBBER', '2024-01-20 12:00:00', '2026-01-20 12:00:00', 7.00, 'São Paulo, SP', 60, @company_id);

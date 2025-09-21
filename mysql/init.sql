-- Cria o banco se não existir
CREATE DATABASE IF NOT EXISTS alexandria_library;

-- Cria ou atualiza o usuário com plugin compatível
CREATE USER IF NOT EXISTS 'gandalf_user'@'%' IDENTIFIED WITH mysql_native_password BY 'you_shall_not_pass123';
ALTER USER 'gandalf_user'@'%' IDENTIFIED WITH mysql_native_password BY 'you_shall_not_pass123';

-- Dá todos os privilégios somente no schema correto
GRANT ALL PRIVILEGES ON alexandria_library.* TO 'gandalf_user'@'%';

-- Aplica mudanças
FLUSH PRIVILEGES;

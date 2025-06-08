# Sustentify

Plataforma de Descarte Sustentável

## Requisitos

Para rodar o projeto é preciso ter uma conta na cloudinary.

Provedor de imagens, que gerencia mídias de forma rápida e escalável, armazena, transforma e otimiza a entrega da mesma.

```bash
  https://cloudinary.com/
```
    
### E-mails

É preciso criar uma senha de app, no seu email, para a plataforma conseguir gerenciar emails e fazer o envio corretamente.

Lembre-se que para utilizar senhas de app, o provedor obriga colocar verificação em duas etapas no seu email.

```bash
  https://myaccount.google.com/apppasswords
```
    
## Abrindo o projeto

Clone o projeto

```bash
  git clone https://github.com/gui-ferreiraa/sustentify-app.git
```

Entre no diretório do projeto

```bash
  cd sustentify-app
```

Entre no diretório de Infra

```bash
  cd infra
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente.

## Servidor

#### Porta em que o backend irá rodar
`PORTA`=3000

## Banco de Dados (MySQL)

#### Nome ou endereço do container/servidor MySQL
`DB_HOST`=mysqldb

#### Porta em que o MySQL está escutando
`DB_PORT`=3306

#### Nome do banco de dados
`DB_NAME`=sustentify_db

#### Usuário e senha do banco de dados
`DB_USERNAME`=root
`DB_PASSWORD`=secret

## JSON Web Token (JWT)

#### Chave secreta para assinar e validar tokens JWT
`JWT_SECRET`=jwtsecret

## Redis (Cache)

#### Nome ou endereço do container/servidor Redis
`REDIS_HOST`=redisdb

#### Porta em que o Redis está escutando
`REDIS_PORT`=6379

#### Senha para autenticação no Redis (se houver)
`REDIS_PASSWORD`=secret

#### Timeout de conexão em milissegundos
`REDIS_TIMEOUT`=10000

## CORS (Cross-Origin Resource Sharing)

#### Origem(s) permitida(s) para acessar sua API (ex.: frontend Angular)
`API_CORS_ORIGIN`=http://localhost:4200

## Cloudinary (Uploads de Imagens)

#### Nome da sua conta (cloud name) no Cloudinary
`CLOUDINARY_NAME`=cloud_name

#### Chave de API e segredo para uploads
`CLOUDINARY_KEY`=cloud_key
`CLOUDINARY_SECRET`=cloud_secret

## Email (SMTP)

#### Host e porta do servidor SMTP
`MAIL_HOST`=smtp.example.com
`MAIL_PORT`=555

#### Credenciais para envio de emails
`MAIL_USERNAME`=example@example.com
`MAIL_PASSWORD`=secret

#### Caminho local (dentro do projeto) para os templates de email
`MAIL_TEMPLATES_PATH`=src/main/resources/templates/mail-templates/

#### Caminho local (dentro do docker) para os templates de email
`MAIL_TEMPLATES_PATH`=/usr/src/server/templates/mail-templates/

## Rodando com docker

Confira o arquivo docker-compose, se a parte de `environment`, em cada serviço do docker estão de acordo com as passadas no env., e rode:

Entre no diretório de Docker

```bash
  cd ./docker
```

Crie as duas redes

```bash
  docker network create assistant-network
  docker network create server-network
```

Escolha qual serviço você quer.

services:
`server`
`assistant`
`web`

E rode
```bash
  docker-compose -f docker-compose.{service}.yaml up --build
```

Ou Rodando tudo
```bash
  docker-compose up --build
```

- Executar o comando `docker compose up -d` para rodar o container do banco de dados
- Executar o comando `npx knex migrate:latest` para criar as tabelas no banco de dados
- Executar o comando `npx knex seed:run` para popular o banco de dados
- Caso seja necessário, para dar um reset no banco de dados use o comando `npm run db:reset`

# Instruções de Autenticação

## Registrar usuário
POST /auth/register  
Payload:
```
{
  "nome": "Seu Nome",
  "email": "email@exemplo.com",
  "senha": "Senha123!"
}
```

## Login
POST /auth/login  
Payload:
```
{
  "email": "email@exemplo.com",
  "senha": "Senha123!"
}
```

Resposta:
```
{
  "access_token": "seu_token_jwt"
}
```

## Usar token JWT
Inclua no header das requisições protegidas:  
Authorization: Bearer seu_token_jwt
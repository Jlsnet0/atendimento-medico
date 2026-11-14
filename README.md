# Sistema de Atendimento Médico

Para evitar a duplicação de arquivos, criamos esta estrutura de pastas para ambos os projetos de POO e REST:

- `banco/`   → schema.sql e dados.sql (compartilhado)
- `poo/`     → projeto Java (POO)
- `backend/` → API Node.js (REST)


## Para inicializar o banco de dados

```bash
docker compose up -d
docker cp banco/schema.sql mysql-atendimento-medico:/var/lib/mysql/schema.sql
docker cp backend/dados/dados.sql mysql-atendimento-medico:/var/lib/mysql/dados.sql
docker exec -it mysql-atendimento-medico sh
```

Uma vez dentro do container:

```bash
cd var/lib/mysql
mysql -u root -p < schema.sql
```

Faça as seguintes requisições no Postman, via servidor backend:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marta Oliveira",
    "email": "marta.secretaria@clinica.com",
    "password": "123456",
    "role": "secretaria"
  }'

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Carlos Mendes",
    "email": "carlos.mendes@clinica.com",
    "password": "123456",
    "role": "medico"
  }'

curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Dra. Helena Souza",
  "email": "helena.souza@clinica.com",
  "password": "123456",
  "role": "medico"
}'

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "password": "123456",
    "role": "paciente"
  }'

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria.santos@email.com",
    "password": "123456",
    "role": "paciente"
  }'

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Lima",
    "email": "pedro.lima@email.com",
    "password": "123456",
    "role": "paciente"
  }'
```

Novamente, dentro do container:

```bash
cd var/lib/mysql
mysql -u api -p atendimento_medico < dados.sql;
```


## Para inicializar o servidor

```bash
cd backend && npm run dev
```

# Sistema de Atendimento Médico

- `banco/`   → schema.sql e dados.sql (compartilhado)
- `poo/`     → projeto Java (POO)
- `backend/` → API Node.js (REST)


## Para inicializar o banco de dados

```bash
docker compose up -d
docker cp banco/schema.sql mysql-atendimento-medico:/var/lib/mysql/schema.sql
docker exec -it mysql-atendimento-medico sh
```

Uma vez dentro do container:

```bash
cd var/lib/mysql
mysql -u root -p < schema.sql
```

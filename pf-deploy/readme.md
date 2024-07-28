# Note: This version allow multiple instances of the app to be deployed on the same VM.

# Get started

- Make `.env` from `.env.example` (Make necessary changes.)
- `docker compose up -d --force-recreate`

# Setup database

- `docker exec -it [DB_CONTAINER_NAME] bash`
- `psql -U postgres -d mydb`
- Don't forget to change the password.

```
REVOKE CONNECT ON DATABASE mydb FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER appuser WITH PASSWORD '5678';
CREATE SCHEMA drizzle;
GRANT ALL ON DATABASE mydb TO appuser;
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL ON SCHEMA drizzle TO appuser;
```

- `docker exec -it [BACKEND_CONTAINER_NAME] sh`
- `npm run db:generate`
- `npm run db:migrate`
psql -U postgres -h 0.0.0.0 -c "CREATE ROLE $PG_USER PASSWORD '$PG_PASSWORD' LOGIN"
createdb -U postgres -h 0.0.0.0 -O $PG_USER $PG_DATABASE
psql -U postgres -h 0.0.0.0 -d $PG_DATABASE -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto"'
# ./setup_postgresql.sh
$(> ./trains.sqlite)
cat ./migrate.sql | sqlite3 ./trains.sqlite

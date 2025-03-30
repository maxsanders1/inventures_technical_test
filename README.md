# Prueba Tecnica de inventures
Para poder ejecutar este codigo de forma local, se tiene que tener Node.js y PostgreSQL en la maquina.
- Node:
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- Postgres:
```
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Configuracion base de datos
Se debe importar a postgres el documento init.sql para la importacion de todos los roles y tablas usadas en el proyecto
```
sudo -i -u postgres
psql
\i init.sql
```


## Inicializacion del proyecto
Una vez la base de datos esta lista, se deben instalar las dependencias del proyecto con:

```
npm i
```
Luego:
```
npm start
```
Con esto, se debe tener el proyecto ejecutando en la ip "localhost:3000" o "127.0.0.1:3000"

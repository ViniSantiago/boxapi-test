Box API - Version 0
-------------------

Comando local:
- docker-compose up -d --build

URL: http://localhost:3443

PATH: /api/v0/ +
user/ +
 - signup/     PUT (name, email, cellphone)
 - getme/      POST (userid)
 - deletebyid/ DELETE (userid)
 - listall/    GET 

Headers: Content-Type=application/json

Local Swagger UI
http://localhost:8009/

Local Node Exporter
http://localhost:9100/

Local Mongo Express
http://localhost:8081/

Local Grafana
http://localhost:3000/
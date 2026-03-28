#!/bin/bash

echo "========================================"
echo "  Inicializando datos de prueba"
echo "  Canelones Pro API"
echo "========================================"
echo ""

API_URL="https://localhost:7001"

echo "Creando recolectores..."
curl -X POST $API_URL/api/collectors -H "Content-Type: application/json" -d '{"id":"RM","name":"Ricardo Morales","document":"4.521.890-2","shift":"Mañana"}' -k
curl -X POST $API_URL/api/collectors -H "Content-Type: application/json" -d '{"id":"EB","name":"Elena Benítez","document":"3.998.123-5","shift":"Tarde"}' -k
curl -X POST $API_URL/api/collectors -H "Content-Type: application/json" -d '{"id":"JS","name":"Jorge Silva","document":"2.114.776-1","shift":"Noche"}' -k
curl -X POST $API_URL/api/collectors -H "Content-Type: application/json" -d '{"id":"MF","name":"María Fontana","document":"5.001.234-9","shift":"Mañana"}' -k

echo ""
echo "Creando vehículos..."
curl -X POST $API_URL/api/vehicles -H "Content-Type: application/json" -d '{"id":"MT-1024","type":"Carga Trasera","capacity":"15.0 t"}' -k
curl -X POST $API_URL/api/vehicles -H "Content-Type: application/json" -d '{"id":"MT-1028","type":"Carga Lateral","capacity":"12.5 t"}' -k
curl -X POST $API_URL/api/vehicles -H "Content-Type: application/json" -d '{"id":"MT-952","type":"Carga Trasera","capacity":"15.0 t"}' -k
curl -X POST $API_URL/api/vehicles -H "Content-Type: application/json" -d '{"id":"EV-004","type":"Utilitario Eléctrico","capacity":"1.2 t"}' -k

echo ""
echo "Creando hogares..."
curl -X POST $API_URL/api/households -H "Content-Type: application/json" -d '{"id":"ID-8829-X","address":"Calle Los Álamos 452","zone":"Zona Norte","qrCode":"QR123456"}' -k
curl -X POST $API_URL/api/households -H "Content-Type: application/json" -d '{"id":"ID-7721-Y","address":"Av. Artigas 1205","zone":"Zona Centro","qrCode":"QR123457"}' -k
curl -X POST $API_URL/api/households -H "Content-Type: application/json" -d '{"id":"ID-9934-Z","address":"Rincón 89","zone":"Zona Sur","qrCode":"QR123458"}' -k

echo ""
echo "========================================"
echo "  Datos de prueba creados exitosamente"
echo "========================================"
echo ""
echo "Puede verificar los datos en:"
echo "$API_URL/swagger"
echo ""

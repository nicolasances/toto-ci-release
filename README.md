# Toto Release MS
Releases the other Toto services.

Example of usage:
```
curl -X POST http://toto-ci-release:8080/releases -H 'x-correlation-id: 123' -d '{"microservice": "toto-nodems-expenses"}' -H 'Content-Type: application/json'
```

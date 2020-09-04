# internshipper

### Development with docker

- Connecting to mongo:

```bash
$ docker exec -it $(docker ps -f name=internshipper_mongo -q) bash
$ mongo -u root -p root --authenticationDatabase admin
```

# internshipper

### Development with docker

- Connecting to mongo:

```bash
$ docker exec -it $(docker ps -f name=internshipper_mongo -q) bash
$ mongo -u root -p root --authenticationDatabase admin
```

### Architectural TODOs

- Use message queues (eg. RabbitMQ) for scheduling polling jobs
  - Better for distributed systems (candidate lib https://arq-docs.helpmanual.io/)
  - Need for central task scheduler
  - Current implementation handles scheduling and execution
    - Schedule tasks on host machine when application boostraps

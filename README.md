# internshipper

## Overview 👩‍🔬

### Why

- Many students have their studies involuntarily prolonged due to a small supply of mandatory internship positions throughout their studies
- These positions are often filled within the first couple minutes of publication, leaving many student without an internship position
- internshipper.io helps these students find an internship position without the need to check for new positions daily

### How

- The students provide their credentials to the platform, criteria for a desired internship position, and email verification
- In return, the platform will frequently poll for such internship positions, and notify the user via email, when a new position is found.
- A user can delete this subscription at any time, including personal data, and found positions. **No strings attached**

### Notes

- Contact me if you wish to expand the implementation of internshipper.io to cover other haka logins

<br />

## Development 👩‍💻

### Client

- Running client dev server:
  - A proxy is enabled if needed. Requires a running `web` container.

```bash
$ yarn start
```

- Building the client

```bash
$ yarn build
```

- Running linter

```bash
$ yarn lint
```

- Running tests

```bash
$ yarn test
```

### Server

- Running the app e2e:

```bash
$ # First make sure your client is built
$ docker-compose up --build nginx
```

- Running backend tests

```bash
$ # Requires mongo, so docker is the easiest option
$ docker-compose up --build test-server
```

- Running backend linter

```bash
$ pipenv run lint
$ # OR
$ docker-compose up --build lint-server
```

- Connecting to mongo:

```bash
$ docker exec -it $(docker ps -f name=internshipper_mongo -q) bash
$ mongo -u root -p root --authenticationDatabase admin
```

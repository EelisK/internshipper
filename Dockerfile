FROM nginx:1.19.2-alpine
COPY --chown=nginx:nginx ./client /srv/app/

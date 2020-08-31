FROM nginx:1.19.2-alpine
ENV BACKEND_SERVER=web:8000
COPY --chown=nginx:nginx ./client /srv/app/client
COPY --chown=nginx:nginx ./nginx/nginx.conf.template /etc/nginx/nginx.conf.template
RUN envsubst '${BACKEND_SERVER}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

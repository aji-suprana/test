FROM nginx

COPY docker/nginx/dev-nginx.conf /etc/nginx/nginx.conf

COPY docker/nginx/dev-certs/private.key /etc/nginx/certs/private.key
COPY docker/nginx/dev-certs/certificate.crt /etc/nginx/certs/certificate.crt

VOLUME [ "/etc/nginx" ]
VOLUME [ "/etc/nginx/certs" ]
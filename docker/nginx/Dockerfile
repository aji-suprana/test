FROM nginx

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY docker/nginx/certs/private.key /etc/nginx/certs/private.key
COPY docker/nginx/certs/certificate.crt /etc/nginx/certs/certificate.crt

VOLUME [ "/etc/nginx" ]
VOLUME [ "/etc/nginx/certs" ]
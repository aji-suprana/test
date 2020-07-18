FROM mysql:5.7

COPY docker/db/dev.init.sql /docker-entrypoint-initdb.d
ENV MYSQL_ROOT_PASSWORD=password

EXPOSE 3306

VOLUME [ "/docker-entrypoint-initdb.d" ]

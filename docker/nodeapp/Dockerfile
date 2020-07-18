FROM node:alpine

WORKDIR /www/nodeapp

# Use Cache Please
ADD package.json /www/nodeapp
RUN npm install

ADD . /www/nodeapp

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# Entrypoint script
RUN cp docker/nodeapp/entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "sh", "/usr/local/bin/entrypoint.sh" ]


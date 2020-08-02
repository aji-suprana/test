FROM node:alpine

WORKDIR /www/nodeapp

# Use Cache Please
ADD package.json /www/nodeapp
RUN npm install

ADD . /www/nodeapp

# Entrypoint script
RUN cp docker/nodeapp/entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "sh", "/usr/local/bin/entrypoint.sh" ]


FROM node:0.12

RUN apt-get update && \
    apt-get upgrade

ADD ./ /srv/caliopen/web
WORKDIR /srv/caliopen/web/

RUN npm install

ENTRYPOINT ["npm"]
EXPOSE 4000
CMD ["run", "start"]

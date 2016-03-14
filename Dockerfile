FROM node:0.12

RUN apt-get update && \
    apt-get upgrade -y

ADD ./ /srv/caliopen/web
WORKDIR /srv/caliopen/web/

RUN bin/install

RUN useradd docker
RUN cp /srv/caliopen/web/docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod 750  /docker-entrypoint.sh
RUN chown docker /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 4000
CMD ["bin/start"]

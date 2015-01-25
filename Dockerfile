<<<<<<< Updated upstream
FROM     mkliu/docker-ionic
MAINTAINER wayliu [at] live [dot] com

RUN git clone https://github.com/wizky/housediary.git /housediary
RUN cd /housediary

EXPOSE 8100
EXPOSE 35729

WORKDIR housediary
CMD ionic serve 8100 35729
=======
FROM     nginx:latest
MAINTAINER wayliu [at] live [dot] com

RUN apt-get update
RUN apt-get -y install git
RUN git clone https://github.com/wizky/housediary.git /housediary
COPY /housediary/www/ /usr/share/nginx/html/
>>>>>>> Stashed changes

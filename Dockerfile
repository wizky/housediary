FROM     nginx:latest
MAINTAINER wayliu [at] live [dot] com

RUN apt-get update
RUN apt-get -y install git
RUN git clone https://github.com/wizky/housediary.git /housediary
COPY /housediary/www/ /usr/share/nginx/html/
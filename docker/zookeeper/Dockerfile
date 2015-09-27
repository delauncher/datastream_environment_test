FROM ubuntu:14.04
MAINTAINER Sean <famersbs@gmail.com>

RUN apt-get update && \
apt-get install -y curl openjdk-7-jre-headless python

# https://www.apache.org/mirrors/dist.html
RUN curl -fL http://apache.mirror.digitalpacific.com.au/zookeeper/stable/zookeeper-3.4.6.tar.gz | tar xzf - -C /opt && \
mv /opt/zookeeper-3.4.6 /opt/zookeeper

# install Git
RUN apt-get install -y git

# install Node
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y build-essential
RUN apt-get install -y nodejs
#RUN apt-get install npm

# check out project
RUN mkdir ~/datastreamenv
RUN git clone https://github.com/famersbs/datastream_environment_test.git ~/datastreamenv/


#RUN ls ~/datastreamenv

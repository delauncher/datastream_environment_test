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

# setting dmsmasq
RUN apt-get install -y dnsmasq

#RUN echo 'address="/dbhost/127.0.0.1"' >> /etc/dnsmasq.d/0hosts

RUN echo 'listen-address=127.0.0.1' >> /etc/dnsmasq.conf
RUN echo 'resolv-file=/etc/resolv.dnsmasq.conf' >> /etc/dnsmasq.conf
RUN echo 'conf-dir=/etc/dnsmasq.d' >> /etc/dnsmasq.conf
RUN echo 'nameserver 8.8.8.8' >> /etc/resolv.dnsmasq.conf
RUN echo 'nameserver 8.8.4.4' >> /etc/resolv.dnsmasq.conf
RUN echo 'user=root' >> /etc/dnsmasq.conf

RUN service dnsmasq start


#RUN ls ~/datastreamenv

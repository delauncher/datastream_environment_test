
# install docker #


## Ubuntu 14.04 ##

### install linux-image-generic-lts-trusty ###


	sudo apt-get update
	sudo apt-get install linux-image-generic-lts-trusty
	sudo reboot


### install curl and run docker install script ###


	sudo apt-get update
	sudo apt-get install curl

	curl -sSL https://get.docker.com/ | sh



## link doc hub (optional) ##


	sudo docker login
	sudo docker pull sequenceiq/spark:1.4.0


## Other optionn

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

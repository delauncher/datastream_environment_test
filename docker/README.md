
# install docker #


## Ubuntu 14.04 ##

### install linux-image-generic-lts-trusty ###

'

	sudo apt-get update
	sudo apt-get install linux-image-generic-lts-trusty
	sudo reboot

'

### install curl and run docker install script ###

'

	sudo apt-get update
	sudo apt-get install curl

	curl -sSL https://get.docker.com/ | sh

'


## link doc hub (optional) ##

'

	sudo docker login
	sudo docker pull sequenceiq/spark:1.4.0

'

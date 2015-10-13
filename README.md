# How to Start delauncher

## Requirement

### Ubuntu 14.0.4

You can use your own server or Virtual Box image.

### Install Docker

	$ sudo apt-get update
	$ sudo apt-get install -y docker.io

	$ sudo service docker.io restart
	
	$ sudo sudo docker login   # https://hub.docker.com account

### Install Node.js

	curl -sL https://deb.nodesource.com/setup | sudo bash -
	apt-get install -y build-essential
	apt-get install -y nodejs

### Check out Node.js Source code

	git clone https://github.com/famersbs/datastream_environment_test.git
	cd datastream_environment_test

## Initialize environment

* modify delauncher/common/config_loader.js

* init node

	cd delauncher
	sudo node app.js init

* run server

	sudo node app.js server server01

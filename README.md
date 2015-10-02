* 데이터 실시간 스트리밍 분석 연습용 스크립트 만들기

	- 목표
		: 개인이 Vbox를 이용하여 테스트를 할 수 있는 환경 구축
			-> Spark, Kafka, Zepplin, Hadoop(?), Etc ( Consumer )

		: 스터디 모임이 개인 테스트 환경을 같이 구축 하여 분산 환경을 구축 할 수 있도록 함

		: Mesos + Marathon 은 추후 스크립트가 완전히 안정화 된 이후에 진행

	- 서버 별 역할

		: Zookeeper Node
			-> 최소 3개 이상의 인스턴스 필요 ( Zookeeper )
			-> 분리 될 수 있음

		: Spark Master Node
			-> 일단 Spark는 Stand alon cluster 모드로 설정 한다.
			-> 최소 3개를 띄운다.

		: Spark Work Node
			-> 최소 3개를 띄운다.

		: Kafka Node

	- 고려 사항

		: hosts 파일 업데이트
			-> 테스트 환경에 등록되는 모든 PC는 가상 도메인을 부여 받아야 함
			-> Virtual OS Image 의 hosts 를 변경 하는 스크립트 필요 ( 특정 문자열로 감싸서 그 부분을 통째로 교체 하는 스크립트 필요 )
			-> 모든 Docker 이미지는 특정 스크립트를 실행 하여, Virtual OS Image의 hosts 파일 설정을 복사 한 뒤 매인 로직을 수행 하도록 변경 필요

		: 설정파일 한곳에 모아서 설정 할 수 있도록 함
			-> 스터디 모임시 설정 파일을 공유 하여, 한번에 설정 되도록 해야 함
			-> 매인 설정 파일이 있고, 나머지 템플릿 설정 파일들은 매인 설정 파일에 따라서 세부 내용이 변경 되어야 함

		: 전체 시스템의 로깅 파일을 한폴더로 모을 수 있으면 좋을 것 같음
			-> 실행 여부나 문제 사항을 파악하기 편리해 질 것 같음

		: 모든 서버 이미지는 DockerHub 에 등록 하여 공유 되도록 한다.
			-> 변경 사항들도 커밋 할 수 있도록 함

	- 구성
		: Docker 이미지들 ( 서버 역할 별 )
			-> 역할 별 보유 Script 가 지정된 위치의 매인 설정 파일 및 서브 템플릿 설정 파일들을 읽어 들여 실행
			-> 이전 설정을 매인 설정 파일로 부터 읽어 들여 로딩

		: 매인 설정 파일 ( Join 할 서버 IP 와 도매인 정보 들 )

		: 템플릿 설정 파일 ( 각 서버 버전 별 필수 템플릿 설정 파일 들 )
			-> 만약 실제 운영 서버로 쓰일 수도 있으므로, 세부 설정을 템플릿 설정 파일에 해두면, 환경에 맞게 진행 되도록 한다.

		: 설정 스크립트
			-> node로 갈까? Python? 아니면 그냥 Shell Script? 
			-> 이부분을 고민해 봐야 할듯 ~!!!


	-> 적용 순서

		: 물리 혹은 가상 서버들을 준비 한다.
			-> zookeeper, Docker 까지는 설치되어 있어야 함 ( 이 부분은 스크립트로 제공 )
			-> 나중에는 자동으로 설치 되도록 할까?

		: 매인 설정 파일을 작성한다.
			-> 물리 혹은 가상 서버 별 IP 정보 및 역할을 기록 한다.
			-> 대상이 될 물리 혹은 가상 서버에 ID를 부여 하는 것이 중요함
			-> 내부 도메인 정보들도 잘 기록 한다.
		
		: 각 서버 에서 지정 된 ID 를 기준으로 매인 스크립트를 실행

		: 해당 스크립트에서 도커 이미지를 이용하여 ID 기준으로 인스턴스들을 실행 한다.
			-> 순서가 중요할 경우, 시퀸스를 맞춰 가면서 진행

		: 매니지 먼트 WEB에 접속 하여, 제대로 동작하는 지 확인

* Todo

	1. Prepare Main Machine
		V : 우분투 이미지 제공 ( 14.04 )
			-> datastreamenv / datastreamenv1234

		V : 기본 환경 설정 ( SSH, Etc... )
			-> update
				: sudo apt-get update

			-> git
				: sudo apt-get install git

		V : Docker 설치 

	2. Make Sample Script for DockerImage
		: zookeeper docker image
			-> based docker image -> ubuntu 14.04
				: 참고
				: https://hub.docker.com/r/mesoscloud/zookeeper/~/dockerfile/
			-> after configuration
				: /etc/zookeeper/conf/myid		-> 호스트 명에 맞게 설정
				: /etc/zookeeper/conf/zoo.cfg 	-> 서버 리스트 및 IP포트 설정
				: Zookeeper Start







*** 인스턴스 실행기가 도커를 띄울 때 사용하는 옵션들

sudo docker run -i -t --dns=127.0.0.1 35a5e6e6e8e6

-d --name=[instance_id]

--add-host server_01:127.0.0.1
--add-host server_02:127.0.0.1

-v ~/tmp/server_01:/tmp/zookeeper
-v ~/datastreamenv:/opt/delauncher

-p 2880:2880
-p 3880:3880
-p 2181:2181

-e INSTANCE_ID=zookeeper_1 
-e CONFIG_FILE_PATH=/tmp/de_conf/config.js
-e NODE_PATH

sudo docker run -i -t -h  --add-host server_01:172.17.42.1 --add-host server_02:172.17.42.1 -v ~/tmp/server_01:/tmp/zookeeper -v ~/datastreamenv:/opt/delauncher -e INSTANCE_ID=zookeeper_1 35a5e6e6e8e6


sudo docker run -d -h server_01 --add-host server_02:172.17.42.1 -v ~/tmp/server_01:/tmp/zookeeper -v ~/datastreamenv:/opt/delauncher -e INSTANCE_ID=zookeeper_1 -e CONFIG_FILE_PATH=null -p 2880:2880 -p 3880:3880 -p 2181:2181 35a5e6e6e8e6 sh /opt/delauncher/config/run.sh

sudo docker run -it -h server_02 --add-host server_01:172.17.42.1 -v ~/tmp/server_02:/tmp/zookeeper -v ~/datastreamenv:/opt/delauncher -e INSTANCE_ID=zookeeper_2 -e CONFIG_FILE_PATH=null -p 2881:2881 -p 3881:3881 -p 2182:2182 35a5e6e6e8e6 sh /opt/delauncher/config/run.sh

** 이미지 내부에 있는 스크립트 ( 고정 )
run.sh
	# node app.js $INSTANCE_ID $CONFIG_FILE_PATH



!!! dnsmasq 설정 ( docker에서 도메인 처리 할때 사용할 수 있는 방법)
	!!! 일단은 사용하지 않음 
apt-get install -y dnsmasq

RUN echo 'address="/dbhost/127.0.0.1"' >> /etc/dnsmasq.d/0hosts

RUN echo 'listen-address=127.0.0.1' >> /etc/dnsmasq.conf
RUN echo 'resolv-file=/etc/resolv.dnsmasq.conf' >> /etc/dnsmasq.conf
RUN echo 'conf-dir=/etc/dnsmasq.d' >> /etc/dnsmasq.conf
RUN echo 'nameserver 8.8.8.8' >> /etc/resolv.dnsmasq.conf
RUN echo 'nameserver 8.8.4.4' >> /etc/resolv.dnsmasq.conf
RUN echo 'user=root' >> /etc/dnsmasq.conf

service dnsmasq start

!!! 참고 문헌
	: http://pyrasis.com/book/DockerForTheReallyImpatient/Chapter13/04
		-> docker hub auto build

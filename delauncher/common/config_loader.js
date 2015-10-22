var envs = require('envs');

var exports = module.exports = {

		server_groups : [
			{
				name:"allservers",
				servers:[
					'server01',
					'server02',
					'server03',
					'server01.mesos.master',
					'server02.mesos.master',
					'server03.mesos.master',
					'server01.mesos.slave01',
					'server02.mesos.slave01',
					'server03.mesos.slave01'
				]
			}
		],
		servers : [

			{
				domain: 'server01',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server01.mesos.master',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server01.mesos.slave01',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server02',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server02.mesos.master',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server02.mesos.slave01',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server03',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server03.mesos.master',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
			{
				domain: 'server03.mesos.slave01',
				ip: '10.0.0.205',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},

		],
		instances : [
			{
				id: 'zookeeper_1',
				type: 'zookeeper',
				target: 'server01',
				docker_img: 'famersbs/zookeeper',
				options:{
					serverNum:1,
					dataDir: '/tmp/zookeeper',
					firstPort:2880,
					secondPort:3880,
					clientPort:2181
				}
			},
	 		{
                id: 'zookeeper_2',
                type: 'zookeeper',
                target: 'server02',
                docker_img: 'famersbs/zookeeper',
                options:{
					serverNum:2,
                    dataDir: '/tmp/zookeeper',
                    firstPort:2881,
                    secondPort:3881,
                    clientPort:2182
            	}
	        },
	        {
                id: 'zookeeper_3',
                type: 'zookeeper',
                target: 'server03',
                docker_img: 'famersbs/zookeeper',
                options:{
					serverNum:3,
                    dataDir: '/tmp/zookeeper',
                    firstPort:2882,
                    secondPort:3882,
                    clientPort:2183
            	}
	        },
	        {
                id: 'mesos-master-1',
                type: 'mesos-master',
                target: 'server01.mesos.master',
                docker_img: 'f32b082e5311',
				quorum:2,
				cluster:'mesos-test-set',
                dataDir: '/tmp/mesos-master',
                port:5050
	        },
	        {
                id: 'mesos-master-2',
                type: 'mesos-master',
                target: 'server02.mesos.master',
                docker_img: 'f32b082e5311',
				quorum:2,
				cluster:'mesos-test-set',
                dataDir: '/tmp/mesos-master',
                port:5051
	        },
	        {
                id: 'mesos-master-3',
                type: 'mesos-master',
                target: 'server03.mesos.master',
                docker_img: 'f32b082e5311',
				quorum:2,
				cluster:'mesos-test-set',
                dataDir: '/tmp/mesos-master',
                port:5052
	        },

	        {
                id: 'mesos-slave-1',
                type: 'mesos-slave',
                target: 'server01.mesos.slave01',
                docker_img: 'f32b082e5311',
                dataDir: '/tmp/mesos-master',
                port:5060
	        },

	        {
                id: 'mesos-slave-2',
                type: 'mesos-slave',
                target: 'server02.mesos.slave01',
                docker_img: 'f32b082e5311',
                dataDir: '/tmp/mesos-master',
                port:5061
	        },

	        {
                id: 'mesos-slave-3',
                type: 'mesos-slave',
                target: 'server03.mesos.slave01',
                docker_img: 'f32b082e5311',
                dataDir: '/tmp/mesos-master',
                port:5062
	        },

	        //f32b082e5311
	        /*
	        {
	        	id: 'kafka_1',
	        	type: 'kafka',
	        	target: 'server01',
	        	docker_img: 'famersbs/kafka',
	        	//docker_img: '7cd5d2131383',
	        	broker_id: 0,
	        	clientPort: 9092,
	        	logDir: '/tmp/kafka/log'
	        },
	        {
	        	id: 'kafka_2',
	        	type: 'kafka',
	        	target: 'server02',
	        	docker_img: 'famersbs/kafka',
	        	//docker_img: '7cd5d2131383',
	        	broker_id: 1,
	        	clientPort: 9093,
	        	logDir: '/tmp/kafka/log'
	        },
	        {
	        	id: 'kafka_3',
	        	type: 'kafka',
	        	target: 'server03',
	        	docker_img: 'famersbs/kafka',
	        	//docker_img: '7cd5d2131383',
	        	broker_id: 2,
	        	clientPort: 9094,
	        	logDir: '/tmp/kafka/log'
	        },
	        {
	        	id: 'spark_1',
	        	type: 'spark',
	        	target: 'server01',
	        	docker_img: 'famersbs/spark',
	        	//docker_img: 'e92cff63ee46',
	        	masterPort: 7071,
	        	masterWebPort: 8081,
	        	workerPort:	9081,
	        	//workerCount: 1,
	        	useZookeeper: true,
	        	//workerMemory:'1g',
	        	//workerCores:1,
	        	dataDir: '/tmp/spark'
	        },
	        {
	        	id: 'spark_2',
	        	type: 'spark',
	        	target: 'server02',
	        	docker_img: 'famersbs/spark',
	        	//docker_img: 'e92cff63ee46',
	        	masterPort: 7072,
	        	masterWebPort: 8082,
	        	workerPort:	9082,
	        	//workerCount: 1,
	        	useZookeeper: true,
	        	//workerMemory:'1g',
	        	//workerCores:1,
	        	dataDir: '/tmp/spark'
	        },
	        {
	        	id: 'spark_3',
	        	type: 'spark',
	        	target: 'server03',
	        	docker_img: 'famersbs/spark',
	        	//docker_img: 'e92cff63ee46',
	        	masterPort: 7073,
	        	masterWebPort: 8083,
	        	workerPort:	9083,
	        	//workerCount: 1,
	        	useZookeeper: true,
	        	//workerMemory:'1g',
	        	//workerCores:1,
	        	dataDir: '/tmp/spark'
	        },
	        {
	        	id: 'spark_4',
	        	type: 'spark',
	        	target: 'server04',
	        	docker_img: 'famersbs/spark',
	        	//docker_img: 'e92cff63ee46',
	        	masterPort: 7074,
	        	masterWebPort: 8084,
	        	workerPort:	9084,
	        	//workerCount: 1,
	        	useZookeeper: true,
	        	//workerMemory:'1g',
	        	//workerCores:1,
	        	dataDir: '/tmp/spark'
	        },
	        {
	        	id: 'spark_5',
	        	type: 'spark',
	        	target: 'server05',
	        	docker_img: 'famersbs/spark',
	        	//docker_img: 'e92cff63ee46',
	        	masterPort: 7075,
	        	masterWebPort: 8085,
	        	workerPort:	9085,
	        	//workerCount: 1,
	        	useZookeeper: true,
	        	//workerMemory:'1g',
	        	//workerCores:1,
	        	dataDir: '/tmp/spark'
	        },
	        */
		],
		
	};

exports.RUN_TYPE = process.argv[2];
exports.INSTANCE_ID = process.argv[3];
exports.SERVER_ID = process.argv[3];
exports.CONFIG_FILE_PATH = process.argv[4];

// Util 
exports.instances.filter = function( _instances ){
	
	return function( fn_filter ){
		var ret = [];

		for( var idx in _instances ){
	        	var instance = _instances[idx];
			if( fn_filter( instance ) ){
				ret.push( instance );
			}

		};

		return ret;
	};
}( exports.instances );

exports.server_groups.getGroupByname = function( _groups ){
	return function( name ){

		for( var i = 0 ; i < _groups.length ; ++ i ){
			if( _groups[i].name == name ){
				return _groups[i].servers;
			}
		}
		return null;

	};
}( exports.server_groups );
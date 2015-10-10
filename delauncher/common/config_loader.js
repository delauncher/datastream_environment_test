var envs = require('envs');

var exports = module.exports = {
		servers : [
			{
				domain: 'server01',
				ip: '192.168.104.75',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
            {
                domain: 'server02',
                ip: '192.168.104.74',
                source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
            },
            {
                domain: 'server03',
                ip: '192.168.104.76',
                source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
            },
            {
                domain: 'server04',
                ip: '192.168.104.82',
                source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
            },
            {
                domain: 'server05',
                ip: '192.168.104.80',
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
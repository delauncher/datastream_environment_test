var envs = require('envs');

var exports = module.exports = {
		servers : [
			{
				domain: 'server_01',
				ip: '172.17.42.1',
				source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
			},
            {
                domain: 'server_02',
                ip: '172.17.42.1',
                source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
            },
            {
                domain: 'server_03',
                ip: '172.17.42.1',
                source_path: '~/datastreamenv',
				datastore_path: '~/tmp',
				log_path: '~/tmp/logs'
            },

		],
		instances : [
			{
				id: 'zookeeper_1',
				type: 'zookeeper',
				target: 'server_01',
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
                target: 'server_02',
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
                target: 'server_03',
                docker_img: 'famersbs/zookeeper',
                options:{
					serverNum:3,
                    dataDir: '/tmp/zookeeper',
                    firstPort:2882,
                    secondPort:3882,
                    clientPort:2183
            	}
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
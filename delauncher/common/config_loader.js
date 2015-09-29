var envs = require('envs');


// Parse Env and 
console.log( "Run Environments-----------------------------");
console.log( "	INSTANCE_ID" , envs('INSTANCE_ID') );
console.log( "	CONFIG_FILE_PATH " , envs('CONFIG_FILE_PATH') );
console.log( "---------------------------------------------");

console.log( "Parameters -----------------------------");
console.log( "	Run Type :" , process.argv[2] );
console.log( "	Instance ID or Server ID :" , process.argv[3] );
console.log( "	Main Config File Path :" , process.argv[4] );
console.log( "---------------------------------------------");


var exports = module.exports = {
		servers : [
			{
				domain: 'server_01',
				ip: '172.17.42.1'
			},
	                {
	                        domain: 'server_02',
	                        ip: '172.17.42.1'
	                },

		],
		instances : [
			{
				id: 'zookeeper_1',
				type: 'zookeeper',
				target: 'server_01',
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
	                        options:{
					serverNum:2,
	                                dataDir: '/tmp/zookeeper',
	                                firstPort:2881,
	                                secondPort:3881,
	                                clientPort:2182
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
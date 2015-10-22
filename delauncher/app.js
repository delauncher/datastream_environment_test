var fs = require("fs");
var envs = require('envs');
var execSync = require('sync-exec');

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

// Load Sub Module
var util = require("./common/util.js");
var LauncherManager = require("./launcher/launcher.js" );

// Main Config Loader
var env = require("./common/config_loader.js");

if( "init" == env.RUN_TYPE){

	console.log( "Start initialize" );

	// pull Docker Images
	var dockerImages = [];
	for( var idx in env.instances ){
		var instance = env.instances[idx];
		dockerImages[ instance.docker_img ] = true;
	}
	for( var idx in dockerImages ){
		console.log( "Pulling :", idx );
		execSync( "sudo docker pull " + idx );
	}

	// hosts file change(?)
	var modifyedHosts = util.getModifyedHosts( env );
	console.log("Modifyed Hosts ( recommend )", "------------");
	console.log( modifyedHosts );
	console.log("-----------------------------------------------");

	// Check setups 

} else if( "hosts" == env.RUN_TYPE ) {

	// hosts file change(?)
	var modifyedHosts = util.getModifyedHosts( env );
	console.log("Modifyed Hosts ( recommend )", "------------");
	console.log( modifyedHosts );
	console.log("-----------------------------------------------");

}else if( "instance" == env.RUN_TYPE ){

	// Step 2. specific env and make environment
	var cur_instance = env.instances.filter( function( instance ){
		return instance.id == env.INSTANCE_ID;
	})[0];

		// Load Launch and setup environment
	LauncherManager.get( cur_instance.type ).run( cur_instance, env  );

} else if( "server" == env.RUN_TYPE || 
	"server_only_cmd" == env.RUN_TYPE ){

	util.run_by_serverid( env, env.RUN_TYPE, env.SERVER_ID, LauncherManager );
	
} else if( "stop_servers" == env.RUN_TYPE ){

	util.stop_by_serverid( env, env.SERVER_ID );

} else if( "start_group" == env.RUN_TYPE ){

	var cur_servers = env.server_groups.getGroupByname( env.SERVER_ID );

	if( null == cur_servers ){
		console.log( "Can not find groups : ", env.SERVER_ID );
		return 0;
	}
	for( var i = 0 ; i < cur_servers.length ; ++ i ){

		console.log("run", cur_servers[i] );
		util.run_by_serverid( env, "server", cur_servers[i], LauncherManager );
	}


} else if( "stop_group" == env.RUN_TYPE ){

	var cur_servers = env.server_groups.getGroupByname( env.SERVER_ID );

	if( null == cur_servers ){
		console.log( "Can not find groups : ", env.SERVER_ID );
		return 0;
	}
	for( var i = 0 ; i < cur_servers.length ; ++ i ){

		console.log("Stop", cur_servers[i] );
		util.stop_by_serverid( env, cur_servers[i] );
	}

}else if( "zookeeper_test" == env.RUN_TYPE ){
	require("./tester/zookeeper_tester.js").test();
}


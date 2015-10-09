var fs = require("fs");
var envs = require('envs');
var execSync = require('sync-exec');

var docker_launcher = require('./common/docker_launcher.js');


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

}else if( "server" == env.RUN_TYPE || 
	"server_only_cmd" == env.RUN_TYPE ){

	// Find Server
	var cur_server;
	for( var idx in  env.servers ){
		if( env.servers[idx].domain == env.SERVER_ID ){
			cur_server = env.servers[idx]; break;
		} 
	}

	var launchers = [];

	// find instances
	for( var idx in env.instances ){
		var instance = env.instances[idx];
		var add_cmd_per_instance = "";

		if( instance.target == env.SERVER_ID ){

			var launcher = docker_launcher.new_launcher();
			launchers[ instance.id ] = launcher;

			launcher.setMode( true );					// daemon set
			launcher.setInstanceName( instance.id ); 	// instance name
			//launcher.setHostName( instance.id );		// host Name
			launcher.setHostName( env.SERVER_ID );		// host Name
			launcher.setImage( instance.docker_img );	// docker image path
			launcher.setExecuteCmd( "sh /run.sh" );		// docker run cmd

			for( var idx in  env.servers ){
				var server = env.servers[idx];
				if( server.domain == env.SERVER_ID ){ continue; } 
				launcher.addHosts( server.domain, server.ip );
			}

			// default volume
			launcher.addVolume( cur_server.source_path, "/opt/delauncher" );

			// set env value
			launcher.addEnvValue( "INSTANCE_ID", instance.id );

			// set log path
			//launcher.setLogFile( server.log_path + "/" + server.domain + "_" + instance.id + ".log" );
			
			// add additional option for each launcher
			LauncherManager.get( instance.type )
				.filloutDockerLauncher( launcher, instance, cur_server, env  );

		}
	}

	for( var idx in launchers )
	{

		console.log( "Execute : ", idx );
		console.log( launchers[idx].getExecuteCmd() );
		if( "server_only_cmd" != env.RUN_TYPE ){
			execSync( launchers[idx].getExecuteCmd() );
		}

	}

} else if( "instance" == env.RUN_TYPE ){

	// Step 2. specific env and make environment
	var cur_instance = env.instances.filter( function( instance ){
		return instance.id == env.INSTANCE_ID;
	})[0];

		// Load Launch and setup environment
	LauncherManager.get( cur_instance.type ).run( cur_instance, env  );

} else if( "stop_servers" == env.RUN_TYPE ){
	// find instances
	for( var idx in env.instances ){
		var instance = env.instances[idx];
		var add_cmd_per_instance = "";

		if( instance.target == env.SERVER_ID ){
			console.log( "Stop : ", instance.id );
			execSync( "sudo docker kill " + instance.id );
			execSync( "sudo docker rm " + instance.id );
		}
	}

} else if( "zookeeper_test" == env.RUN_TYPE ){
	require("./tester/zookeeper_tester.js").test();
}


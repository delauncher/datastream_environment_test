var fs = require("fs");

var exports = module.exports = {};

exports.writeFileSync_overwrrite = function( path, data ){
        if( fs.existsSync( path + '.tmp' ) ) {
                fs.unlinkSync( path + '.tmp' );
        }
	if( fs.existsSync( path ) ){
        	fs.renameSync( path, path + '.tmp' );
	}
        fs.writeFileSync( path, data, 'utf8' );
};


exports.getModifyedHosts = function( env ){

	var BEGIN_STR = '########## datastreamenv hosts config ##########';
	var END_STR = '########## datastreamenv hosts config end ##########';

		// make hosts adding part
	var addstr = "";
	for( var idx in  env.servers ){
		var server = env.servers[idx];
		addstr = addstr + server.ip + '\t' + server.domain + '\n';
	}
		// make hosts file
	var hosts = fs.readFileSync( "/etc/hosts", "utf8" );

	var startat = hosts.indexOf( BEGIN_STR );
	var endat = hosts.indexOf( END_STR );

	if( startat > -1 ) {
		if( startat > 0 ) startat = startat - 1;
		// remove before
		hosts = hosts.slice( 0, startat ) + 
			hosts.slice( endat + END_STR.length );
	}

	hosts = hosts + "\n" + BEGIN_STR + "\n" + addstr + END_STR;

		// write to hosts
	//exports.writeFileSync_overwrrite( '/etc/hosts', hosts );
	return hosts;

};

exports.update_dnsmasq = function( env ){

	var hosts = "";
	for( var idx in  env.servers ){
                var server = env.servers[idx];
                hosts = hosts + "address=/" + server.domain + '/' + server.ip + '\n';
        }

	exports.writeFileSync_overwrrite( '/etc/dnsmasq.d/0hosts', hosts );
};

// Launcher Docker
var docker_launcher = require('../common/docker_launcher.js');
var execSync = require('sync-exec');
exports.run_by_serverid = function( env, RUN_TYPE, SERVER_ID, LauncherManager ){
	// Find Server
	var cur_server;
	for( var idx in  env.servers ){
		if( env.servers[idx].domain == SERVER_ID ){
			cur_server = env.servers[idx]; break;
		} 
	}

	var launchers = [];

	// find instances
	for( var idx in env.instances ){
		var instance = env.instances[idx];
		var add_cmd_per_instance = "";

		if( instance.target == SERVER_ID ){

			var launcher = docker_launcher.new_launcher();
			launchers[ instance.id ] = launcher;

			launcher.setMode( true );					// daemon set
			launcher.setInstanceName( instance.id ); 	// instance name
			//launcher.setHostName( instance.id );		// host Name
			launcher.setHostName( SERVER_ID );		// host Name
			launcher.setImage( instance.docker_img );	// docker image path
			launcher.setExecuteCmd( "sh /run.sh" );		// docker run cmd

			for( var idx in  env.servers ){
				var server = env.servers[idx];
				if( server.domain == SERVER_ID ){ continue; } 
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
		if( "server_only_cmd" != RUN_TYPE ){
			execSync( launchers[idx].getExecuteCmd() );
		}

	}
}
exports.stop_by_serverid = function( env, SERVER_ID ){
	// find instances
	for( var idx in env.instances ){
		var instance = env.instances[idx];
		var add_cmd_per_instance = "";

		if( instance.target == SERVER_ID ){
			console.log( "Stop : ", instance.id );
			execSync( "sudo docker kill " + instance.id );
			execSync( "sudo docker rm " + instance.id );
		}
	}
}
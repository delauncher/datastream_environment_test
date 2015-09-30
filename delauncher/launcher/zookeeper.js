// Launcher
var util = require("../common/util.js");
var mkdirp = require('mkdirp');

var exports = module.exports = {};

exports.run = function( instance, env ){
	// Make configure file

	var default_str = 	"tickTime=2000\n" +
				"initLimit=5\n" +
				"syncLimit=2\n" +
				"dataDir=" + instance.options.dataDir + "\n" +
				"clientPort=" + instance.options.clientPort + "\n";

	
		// Make Server Strings
	var zookeepers = env.instances.filter( function( instance ){ return instance.type == "zookeeper"; } );
	var servers_str = "";

	for( var i = 0 ; i < zookeepers.length ; ++ i ){
		var target = zookeepers[i].target;
		/*
		if( instance.id == zookeepers[i].id ){
			target = "127.0.0.1"
		}
		*/

		servers_str = servers_str + 'server.' + zookeepers[i].options.serverNum + '=' + 
					target + ":" + 
					zookeepers[i].options.firstPort + ":" +
					zookeepers[i].options.secondPort + "\n";
	}

	//console.log( default_str );
	//console.log( servers_str );

	// Write Config file
	util.writeFileSync_overwrrite( "/opt/zookeeper/conf/zoo.cfg", default_str + servers_str );		

	// Write MyID
	util.writeFileSync_overwrrite( "/tmp/zookeeper/myid", "" + instance.options.serverNum );	

};

exports.filloutDockerLauncher= function( launcher, instance, cur_server, env ){


	var datastorage = cur_server.datastore_path + "/" + 
						env.SERVER_ID + "/" +
						instance.id + "/datadir";

	mkdirp.sync( datastorage );
	launcher.addVolume( datastorage, instance.options.dataDir );
	
	launcher.addPortForward( instance.options.firstPort, instance.options.firstPort );
	launcher.addPortForward( instance.options.secondPort, instance.options.secondPort );
	launcher.addPortForward( instance.options.clientPort, instance.options.clientPort );


};
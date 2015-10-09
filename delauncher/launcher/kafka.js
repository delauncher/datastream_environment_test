// Launcher
var util = require("../common/util.js");
var mkdirp = require('mkdirp');

var exports = module.exports = {};

exports.run = function( instance, env ){
	// Make configure file

	var default_str = 	"broker.id=" + instance.broker_id + "\n" +
						"port=" + instance.clientPort + "\n" +
						"advertised.host.name=" + instance.target + "\n" +
						"num.network.threads=2" + "\n" +
						"num.io.threads=2" + "\n" +
						"socket.send.buffer.bytes=1048576" + "\n" +
						"socket.receive.buffer.bytes=1048576" + "\n" +
						"socket.request.max.bytes=104857600" + "\n" +
						"num.partitions=2" + "\n" +
						"log.dirs=" + instance.logDir + "\n" +
						"log.flush.interval.messages=10000" + "\n" +
						"log.flush.interval.ms=1000" + "\n" +
						"log.retention.hours=168" + "\n" +
						"log.segment.bytes=536870912" + "\n" +
						"log.cleanup.interval.mins=1" + "\n";
						//"zookeeper.connect=192.168.104.62:2181,192.168.104.66:2181,192.168.104.68:2181;

	
		// Make Server Strings
	var zookeepers = env.instances.filter( function( instance ){ return instance.type == "zookeeper"; } );
	var zookeeper_str = "zookeeper.connect=";

	for( var i = 0 ; i < zookeepers.length ; ++ i ){
		if( i > 0 ) {
			zookeeper_str = zookeeper_str + ",";
		}
		var target = zookeepers[i].target;
		zookeeper_str = zookeeper_str + target + ":" + 
						zookeepers[i].options.clientPort;
	}

	//console.log( default_str );
	//console.log( servers_str );

	// Write Config file
	util.writeFileSync_overwrrite( "/opt/kafka/config/server.properties", default_str + zookeeper_str );		


};

exports.filloutDockerLauncher= function( launcher, instance, cur_server, env ){


	var datastorage = cur_server.datastore_path + "/" + 
						env.SERVER_ID + "/" +
						instance.id + "/logs";

	mkdirp.sync( datastorage );
	launcher.addVolume( datastorage, instance.logDir );
	
	launcher.addPortForward( instance.clientPort, instance.clientPort );

};
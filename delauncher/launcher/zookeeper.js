// Launcher
var util = require("../common/util.js");

var exports = module.exports = {};

exports.run = function( instance, env ){
	// Make configure file

	var default_str = 	"tickTime=2000\n" +
				"initLimit=10\n" +
				"syncLimit=5\n" +
				"dataDir=" + instance.options.dataDir + "\n" +
				"clientPort=" + instance.options.clientPort + "\n";

	
		// Make Server Strings
	var zookeepers = env.instances.filter( function( instance ){ return instance.type == "zookeeper"; } );
	var servers_str = "";
	for( var i = 0 ; i < zookeepers.length ; ++ i ){
		servers_str = servers_str + 'server.' + zookeepers[i].options.serverNum + '=' + 
				zookeepers[i].target + ":" + 
					zookeepers[i].options.firstPort + ":" +
					zookeepers[i].options.secondPort + "\n";
	}

	console.log( default_str );
	console.log( servers_str );

	// Write Config file
	util.writeFileSync_overwrrite( "/opt/zookeeper/conf/zoo.cfg", default_str + servers_str );		

	// Write MyID
	util.writeFileSync_overwrrite( "/tmp/zookeeper/myid", "" + instance.options.serverNum );	

};

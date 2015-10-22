// Launcher
var util = require("../common/util.js");
var mkdirp = require('mkdirp');

var envs = require('envs');
var sleep = require("sleep");
var execSync = require('sync-exec');

var exports = module.exports = {};


// Run options
// Work dir
// zk
// --log_dir=VALUE 
// --hostname=VALUE
/*
--work_dir=VALUE                         Directory path to store the persistent information stored in the 
                                           Registry. (example: /var/lib/mesos/master)
  --zk=VALUE                               ZooKeeper URL (used for leader election amongst masters)

 */

exports.run = function( instance, env ){

	var envScript = "";

	// make --zk option
	var zookeepers = env.instances.filter( function( instance ){ return instance.type == "zookeeper"; } );
	var servers_str = "";
	var ClusterEnvStr = '--zk=zk://'
	for( var i = 0 ; i < zookeepers.length ; ++ i ){
		if( i > 0 ) ClusterEnvStr = ClusterEnvStr + ",";

		ClusterEnvStr = ClusterEnvStr +  
					zookeepers[i].target + ":" +
					zookeepers[i].options.clientPort;
	}
	ClusterEnvStr = ClusterEnvStr + '/mesos';

	// -- hostname
	var HostNameStr = "--hostname=" + instance.target;

	// --log_dir
	var log_dir = instance.dataDir + "/log/";
	mkdirp.sync( log_dir );
	var LogDirStr = "--log_dir=" + log_dir;

	// --port
	var PortStr = "--port=" + instance.port;

	// --quorum
	var QuorumStr = "--quorum=" + instance.quorum;

	// -- work_dir
	var worker_dir = instance.dataDir + "/work/";
	mkdirp.sync( worker_dir );
	var WorkDirStr = '--work_dir=' + worker_dir;

	// --advertise_ip
	var AdvertiseIP = '--advertise_ip=' + '10.0.0.205';

	// -- cluster id
	var ClusterID = '--cluster=' + instance.cluster;

	// -- ip
	var IPStr = '--ip=0.0.0.0';

	// Run master
	var master_execute_cmd = "/opt/mesos/build/bin/mesos-master.sh " +
								ClusterEnvStr + " " +
								HostNameStr + " " +
								LogDirStr + " " +
								PortStr + " " +
								QuorumStr + " " +
								WorkDirStr + " " + 
								//AdvertiseIP + " " +
								IPStr + " " +
								ClusterID
								;

	util.writeFileSync_overwrrite( "/run_mesos.sh", envScript + master_execute_cmd + "\n" );		

	execSync( "chmod 755 /run_mesos.sh" );
	
};

exports.filloutDockerLauncher= function( launcher, instance, cur_server, env ){


	var datastorage = cur_server.datastore_path + "/" + 
						env.SERVER_ID + "/" +
						instance.id + "/datadir";

	mkdirp.sync( datastorage );
	launcher.addVolume( datastorage, instance.dataDir );
	
	launcher.addPortForward( instance.port, instance.port );


};
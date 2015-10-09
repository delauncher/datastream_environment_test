// Launcher
var util = require("../common/util.js");
var mkdirp = require('mkdirp');

var envs = require('envs');
var sleep = require("sleep");
var execSync = require('sync-exec');

var exports = module.exports = {};


exports.run = function( instance, env ){

	var envScript = "";

	// Make Spark Master url 
	var sparks = env.instances.filter( function( instance ){ return instance.type == "spark"; } );
	var sparkMasterUrl = "spark://";
	for( var i = 0 ; i < sparks.length ; ++ i ){
		if( i > 0 ) sparkMasterUrl = sparkMasterUrl + ",";
		sparkMasterUrl = sparkMasterUrl +
							sparks[i].target + ":" +
							sparks[i].masterPort;
	}

	// Set SPARK_DAEMON_JAVA_OPTS
	var zookeepers = env.instances.filter( function( instance ){ return instance.type == "zookeeper"; } );
	var servers_str = "";
	var ClusterEnvStr = '"-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url='
	for( var i = 0 ; i < zookeepers.length ; ++ i ){
		if( i > 0 ) ClusterEnvStr = ClusterEnvStr + ",";

		ClusterEnvStr = ClusterEnvStr +  
					zookeepers[i].target + ":" +
					zookeepers[i].options.clientPort;
	}
	ClusterEnvStr = ClusterEnvStr + '"';
	//envs( "SPARK_DAEMON_JAVA_OPTS", ClusterEnvStr );
	envScript = envScript + "export SPARK_DAEMON_JAVA_OPTS="+ ClusterEnvStr + "\n";

	// Create master and work dir
	var local_dir = instance.dataDir + "/local/";
	var worker_dir = instance.dataDir + "/worker/";
	mkdirp.sync( local_dir );
	mkdirp.sync( worker_dir );

	envScript = envScript + "export SPARK_LOCAL_DIRS="+ local_dir + "\n";
	envScript = envScript + "export SPARK_WORKER_DIR="+ worker_dir + "\n";

	// set webUI port
	envScript = envScript + "export SPARK_MASTER_WEBUI_PORT=" + instance.masterWebPort + "\n";
	envScript = envScript + "export SPARK_WORKER_PORT=" + instance.workerPort + "\n";
	// Run master
	var master_execute_cmd = "/opt/spark/sbin/start-master.sh -h " + instance.target + " -p " + instance.masterPort;
	util.writeFileSync_overwrrite( "/run_master.sh", envScript + master_execute_cmd + "\n" );		
	execSync( "sh /run_master.sh" );

	// Run slave
	var slave_execute_cmd = "/opt/spark/sbin/start-slave.sh -h " + instance.target + " " +  sparkMasterUrl;
	util.writeFileSync_overwrrite( "/run_slave.sh", envScript + slave_execute_cmd + "\n" );		
	sleep.sleep(10);// wait for 10 seconds
	execSync( "sh /run_slave.sh" );

	// wait infiniti
	while( true ){
		sleep.sleep(10);
		execSync( "sh /run_slave.sh" );
	}
	
};

exports.filloutDockerLauncher= function( launcher, instance, cur_server, env ){


	var datastorage = cur_server.datastore_path + "/" + 
						env.SERVER_ID + "/" +
						instance.id + "/datadir";

	mkdirp.sync( datastorage );
	launcher.addVolume( datastorage, instance.dataDir );
	
	launcher.addPortForward( instance.masterPort, instance.masterPort );
	launcher.addPortForward( instance.masterWebPort, instance.masterWebPort );
	launcher.addPortForward( instance.workerPort, instance.workerPort );


};
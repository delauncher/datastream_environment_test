var fs = require("fs");


// options for test
var util = {};
util.writeFileSync_overwrrite = function( path, data ){
        if( fs.existsSync( path + '.tmp' ) ) {
                fs.unlinkSync( path + '.tmp' );
        }
        fs.renameSync( path, path + '.tmp' );
        fs.writeFileSync( path, data, 'utf8' );
};


var env = {

	servers : [
		{
			domain: 'server_01',
			ip: '127.0.0.1'
		},
                {
                        domain: 'server_02',
                        ip: '127.0.0.1'
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
                                clientPort:2181
                        }
                },
	],
	
};

// option - instance_id
var  instance_id = 'zookeeper_1'

// Step 1. common env
var step_set_hosts = function(){

	var BEGIN_STR = '########## datastreamenv hosts config ##########';
	var END_STR = '########## datastreamenv hosts config end ##########';

		// make hosts adding part
	var addstr = "";
	for( var idx in  env.servers ){
		var server = env.servers[idx];
		addstr = addstr + server.domain + '\t' + server.ip + '\n';
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
	util.writeFileSync_overwrrite( '/etc/hosts', hosts );
/*
	if( fs.existsSync('/etc/hosts.tmp' ) ) {
		fs.unlinkSync( '/etc/hosts.tmp' );
	}
	fs.renameSync( '/etc/hosts', '/etc/hosts.tmp' );
	fs.writeFileSync('/etc/hosts', hosts, 'utf8' );	
*/
};
step_set_hosts();

// Step 2. specific env
env.instances.filter = function( fn_filter ){
	var ret = [];

	for( var idx in env.instances ){
        	var instance = env.instances[idx];
		if( fn_filter( instance ) ){
			ret.push( instance );
		}

	};

	return ret;
};


var create_run_script = function( instance, env ){

	if( instance.type == "zookeeper" ){

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

	}
};

var cur_instance = env.instances.filter( function( instance ){
	return instance.id == instance_id;
})[0];

create_run_script( cur_instance, env );

// Step 3. make run.sh

// Step 4. end

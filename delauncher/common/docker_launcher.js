
var exports = module.exports = {};

var DockerLauncher = function(){
	this._options = {
		hosts: [],
		volumes: [],
		portforward: [],
		envvar:[],
		extraopt:""
	};
};

DockerLauncher.prototype = {

	setInstanceName : function( name ){
		this._options.instance_name = name;
	},
	setMode: function( daemon ){
		this._options.mode = daemon;
	},
	setHostName: function( host_name ){
		this._options.host_name = host_name;
	},

	setImage: function( imagepath ){
		this._options.imagepath = imagepath;
	},
	setExecuteCmd: function( cmd ){
		this._options.cmd = cmd;
	},
	setLogFile: function( path ){
		this._options.logpath = path;
	},

	addHosts: function( domain, ip ){
		this._options.hosts.push( { domain: domain, ip : ip } );
	},
	
	addVolume: function( hostpath, virtualpath ){
		this._options.volumes.push( { hostpath:hostpath, virtualpath:virtualpath } );
	},
	addPortForward: function( hostPort, virtualPort ){
		this._options.portforward.push( {hostPort:hostPort, virtualPort:virtualPort } );
	},
	addEnvValue: function( id, value ){
		this._options.envvar.push( {id:id, value:value } );
	},
	addExtraParam: function( option ){
		this._options.extraopt = this._options.extraopt + option + " ";
	},
	
	getExecuteCmd: function(){
		var command = " sudo docker run -d ";
		var options = this._options;

		command = command + "-h " + options.host_name +
					" --name " + options.instance_name;

		for( var idx in options.hosts ){
			var host = options.hosts[ idx ];
			command = command + " --add-host " + host.domain + ':' + host.ip + ' ';
		}

		for( var idx in options.volumes ){
			var volume = options.volumes[ idx ];
			command = command + " -v " + volume.hostpath + ':' + volume.virtualpath + ' ';
		}

		for( var idx in options.portforward ){
			var port = options.portforward[ idx ];
			command = command + " -p " + port.hostPort + ':' + port.virtualPort + ' ';
		}

		for( var idx in options.envvar ){
			var env = options.envvar[ idx ];
			command = command + " -e " + env.id + '=' + env.value + ' ';
		}

		command = command + " " + options.extraopt + " " + options.imagepath + " " + options.cmd;

		if( undefined != options.logpath && null != options.logpath ){
			command = command + " >> " + options.logpath + " ";
		}


		return "sudo docker kill " + this._options.instance_name + "\n" + 
				"sudo docker rm " + this._options.instance_name  + "\n" + 
				command;
	}

};

exports.new_launcher = function(){

	return new DockerLauncher();

}
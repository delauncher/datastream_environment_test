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


exports.update_Hosts = function( env ){

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
	exports.writeFileSync_overwrrite( '/etc/hosts', hosts );

};

exports.update_dnsmasq = function( env ){

	var hosts = "";
	for( var idx in  env.servers ){
                var server = env.servers[idx];
                hosts = hosts + "address=/" + server.domain + '/' + server.ip + '\n';
        }

	exports.writeFileSync_overwrrite( '/etc/dnsmasq.d/0hosts', hosts );
};
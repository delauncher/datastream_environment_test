var fs = require("fs");

// Load Sub Module
var util = require("./common/util.js");
var launcher = require("./launcher/launcher.js" );

// Main Config Loader
var env = require("./common/config_loader.js");

// Step 1. common env
	// util.update_Hosts( env );
	// util.update_dnsmasq( env );

// Step 2. specific env and make environment
var cur_instance = env.instances.filter( function( instance ){
	return instance.id == env.INSTANCE_ID;
})[0];


	// Load Launch and setup environment
launcher.get( cur_instance.type ).run( cur_instance, env  );

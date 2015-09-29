var exports = module.exports = {};


exports.get = function( name ){

	return require( "./" + name + ".js" );

};
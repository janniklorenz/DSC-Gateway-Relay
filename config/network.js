module.exports = {
	/**
		Networking settings
		Settings for the HTTP module.
	*/


	/**
		Default port for the clients
	*/
	relay: {
		/**
			port
		*/
		port		:	4001,

		/**
			address
			IPv4/ IPv6 address to bin on. (BSP: "::1")
		*/
		address		: 	"0.0.0.0",
	},


	/**
		A DSC-Gateway will connect to this address to push the data.
	*/
	controller: {
		/**
			port
		*/
		port		:	4011,

		/**
			address
			IPv4/ IPv6 address to bin on. (BSP: "::1")
		*/
		address		: 	"0.0.0.0",
	}
};

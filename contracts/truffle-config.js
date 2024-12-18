module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 8545,            // Standard Ethereum port (default: none)
        network_id: "*",       // Match any network id
      },
    },
  
    // Set default mocha options here, use special reporters etc.
    mocha: {
      timeout: 100000
    },
  
    compilers: {
      solc: {
        version: "0.8.0",      // Specify the compiler version
      }
    }
  };
  
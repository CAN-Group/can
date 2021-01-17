const apiConnector = {
    address: '127.0.0.1',
    port: 5000,
    version: 'v1',
    
    endpoint: function(endpoint = '/') 
    {
         return `http://${this.address}:${this.port}/api/${this.version}/${endpoint}`; 
    },
    
    staticRes: function(endpoint)
    {
        return `http://${this.address}:${this.port}/static/${endpoint}`;
    }
};

export default apiConnector;
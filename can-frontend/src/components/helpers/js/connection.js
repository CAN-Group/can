const apiConnector = {
    address: '127.0.0.1',
    port: 5010,
    version: 'v1',
    
    endpoint: function(endpoint = '/') {
         return `http://${this.address}:${this.port}/api/${this.version}/${endpoint}`; 
    },
    
    staticRes: function(endpoint) {
        return `http://${this.address}:${this.port}/static/${endpoint}`;
    },

    route: function(coords, counties, routeProfile) {
        const queryString = `?coords=${coords.start[0]},${coords.start[1]}|${coords.end[0]},${coords.end[1]}&counties=${counties.join(',')}&profile=${routeProfile}`;

        const req = `http://${this.address}:${this.port}/api/${this.version}/route${queryString}`;
        return req;
    }
};

export default apiConnector;
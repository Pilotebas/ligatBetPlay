import { MongoClient } from "mongodb";

export class connect {
    static instance;
    user;
    port;
    #pass;
    #host;
    #cluster;
    #dbName
    constructor() {
        if(typeof connect.instance === 'object'){
            return connect.instance;
        }

        this.user = process.env.user
        this.port = process.env.port
        this.setPass = process.env.pass
        this.setHost = process.env.host
        this.setCluster = process.env.cluster
        this.setDbName = process.env.dbName
        this.#open();
        connect.instance = this;
        return this
    }
    set setPass(pass) {
        this.#pass = pass;
    }
    set setHost(host) {
        this.#host = host;
    }
    set setCluster(cluster) {
        this.#cluster = cluster;
    }
    set setDbName(dbName) {
        this.#dbName = dbName;
    }
    get getPass(){
        return this.#pass
    }
    get getHost(){
        return this.#host
    }
    get getCluster(){
        return this.#cluster
    }
    get getDbName(){
        return this.#dbName
    }
    async #open () {
        this.conexion = new MongoClient(`${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/${this.getDbName}`)
    }
}
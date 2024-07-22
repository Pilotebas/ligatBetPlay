import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb"; 

export class equipo extends connect {
    static instance;
    constructor() {
        if (typeof equipo.instance === "object") {
            return equipo.instance;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("equipos");
        equipo.instance = this;
        return this;
    }

    async getAll() {
        let activities = await this.collection.find({}).toArray();
        return activities;
    }

}

import { connect } from "../../helpers/db/connect.js";

export class equipo extends connect {
    static instance
    constructor() {
        if (typeof equipo.instance === "object"){
            return equipo.instance
        }
        super();
        this.collecction = this.db.collection("equipos");
        equipo.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
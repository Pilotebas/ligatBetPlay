import { connect } from "../../helpers/db/connect.js";

export class comunicacion extends connect {
    static instance
    constructor() {
        if (typeof comunicacion.instance === "object"){
            return comunicacion.instance
        }
        super();
        this.collecction = this.db.collection("comunicaciones");
        comunicacion.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
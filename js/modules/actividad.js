
import { connect } from "./connect.js";

export class actividad extends connect {
    static instance
    constructor(conexion) {
        if (typeof actividad.instance === "object"){
            return actividad.instance
        }
        super(conexion);
        this.collecction = this.db.collection("actividad");
        actividad.instance = this;
        return this;
    }

    async getAllactivies() {
        let activities  = await this.collecction.find({}).toArray()
        return activities
    }
}
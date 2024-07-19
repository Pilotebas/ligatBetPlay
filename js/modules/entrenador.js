import { connect } from "../../helpers/db/connect.js";

export class entrenador extends connect {
    static instance
    constructor() {
        if (typeof entrenador.instance === "object"){
            return entrenador.instance
        }
        super();
        this.collecction = this.db.collection("entrenadores");
        entrenador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
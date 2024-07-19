import { connect } from "../../helpers/db/connect.js";

export class jugador extends connect {
    static instance
    constructor() {
        if (typeof jugador.instance === "object"){
            return jugador.instance
        }
        super();
        this.collecction = this.db.collection("jugadores");
        jugador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
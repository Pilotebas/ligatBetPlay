import { connect } from "../../helpers/db/connect.js";

export class entrada extends connect {
    static instance
    constructor() {
        if (typeof entrada.instance === "object"){
            return entrada.instance
        }
        super();
        this.collecction = this.db.collection("entradas");
        entrada.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
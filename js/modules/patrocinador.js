import { connect } from "../../helpers/db/connect.js";

export class patrocinador extends connect {
    static instance
    constructor() {
        if (typeof patrocinador.instance === "object"){
            return patrocinador.instance
        }
        super();
        this.collecction = this.db.collection("patrocinadores");
        patrocinador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
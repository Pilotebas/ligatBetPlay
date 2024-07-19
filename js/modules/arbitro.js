import { connect } from "../../helpers/db/connect.js";

export class arbitro extends connect {
    static instance
    constructor() {
        if (typeof arbitro.instance === "object"){
            return arbitro.instance
        }
        super();
        this.collecction = this.db.collection("arbitros");
        arbitro.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
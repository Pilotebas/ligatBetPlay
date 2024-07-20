import { connect } from "../../helpers/db/connect.js";

export class aficionado extends connect {
    static instance
    constructor() {
        if (typeof afficionado.instance === "object"){
            return afficionado.instance
        }
        super();
        this.collecction = this.db.collection("aficcionados");
        afficionado.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
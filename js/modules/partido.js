import { connect } from "../../helpers/db/connect.js";

export class partido extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.collecction = this.db.collection("partidos");
        partido.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
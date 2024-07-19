import { connect } from "../../helpers/db/connect.js";

export class estadio extends connect {
    static instance
    constructor() {
        if (typeof estadio.instance === "object"){
            return estadio.instance
        }
        super();
        this.collecction = this.db.collection("estadios");
        estadio.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
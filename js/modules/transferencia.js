import { connect } from "../../helpers/db/connect.js";

export class transferencia extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.collecction = this.db.collection("trasferencias");
        partido.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
}
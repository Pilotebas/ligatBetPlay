import { connect } from "../../helpers/db/connect.js";

export class aficionado extends connect {
    static instance
    constructor() {
        if (typeof aficionado.instance === "object"){
            return aficionado.instance
        }
        super();
        this.collecction = this.db.collection("aficionados");
        aficionado.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collecction.find({}).toArray()
        return activities
    }
}
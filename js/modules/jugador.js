import { connect } from "../../helpers/db/connect.js";

export class jugador extends connect {
    static instance
    constructor() {
        if (typeof jugador.instance === "object"){
            return jugador.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("jugadores");
        jugador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    // validacionc5(){
    //     const obj = {
    //         validaciones: [
    //             {
    //                 informe: "jugador",
    //                 id: new ObjectId("669bd1b40fdab186cea16d4c"),
    //                 filtro: "ascendente"
    //             },
    //             {
    //                 informe: "equipos",
    //                 id: new ObjectId("669bd1b40fdab186cea16d4c"),
    //                 filtro: "descendente"
    //             }
    //         ]
    //     }
    // }
}
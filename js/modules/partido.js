import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";


export class partido extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.collection = this.db.collection("partidos");
        partido.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    validacion(){
        const obj = {
            equipoLocal: new ObjectId("669bd7b50fdab186cea16d78"),
            equipoVisitante: new ObjectId("669bd7b50fdab186cea16d79"),
            fecha: new Date("2024-08-01"),
            hora: "16:00",
            estadio: new ObjectId("669bd1360fdab186cea16d42")
        }
        let {equipoLocal, equipoVisitante, fecha, hora, estadio} = obj
        return (this.registrarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio))
    }

    async registrarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio){
        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                hora: 1,
                fecha: 1,
                estadio: 1
              }
            }
          ]).toArray()
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            if(res[i].estadio.toString() === estadio.toString() && res[i].fecha.getTime() === fecha.getTime()){
                return {
                    descripcion: "La fecha y el estadio coinciden con otro partido previamente asignado"
                }
            }
        }
    }
}
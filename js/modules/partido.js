import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";


export class partido extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("partidos");
        partido.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    objetoc3(){
        const obj = {
            equipoLocal: new ObjectId("669bd7b50fdab186cea16d79"),
            equipoVisitante: new ObjectId("669bd7b50fdab186cea16d78"),
            fecha: new Date("2024-08-30"),
            hora: "16:00",
            estadio: new ObjectId("669bd1360fdab186cea16d42"),
            arbitro: new ObjectId("669adc5ff75237d05bf6a9d3")
        }
        let {equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro} = obj
        return (this.validacionPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro))
    }

    async validacionPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro){

        const estadioExist = await this.db.collection('estadios').findOne({_id : estadio})
        if(!estadioExist){
            return { error : "El estadio no existe"}
        }

        const equipoLocalExist = await this.db.collection('equipos').findOne({_id : equipoLocal})
        if(!equipoLocalExist){
            return { error : "El equipo local no existe"}
        }
        const equipoVisExist = await this.db.collection('equipos').findOne({_id : equipoVisitante})
        if(!equipoVisExist){
            return { error : "El equipo visitante no existe"}
        }

        if(equipoLocal.toString() === equipoVisitante.toString()){
            return {error: "Los equipos no pueden ser los mismos"}
        }
        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                hora: 1,
                fecha: 1,
                estadio: 1,
                equipoLocal: 1,
                equipoVisitante: 1,
                arbitro: 1
              }
            }
          ]).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].estadio.toString() === estadio.toString() && res[i].fecha.getTime() === fecha.getTime()){
                return {
                    error: "La fecha y el estadio coinciden con otro partido previamente asignado"
                }
            }
        }

        for (let i = 0; i < res.length; i++) {
            if((res[i].equipoLocal.toString() === equipoLocal.toString() || res[i].equipoVisitante.toString() === equipoLocal.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo local ya tiene asigando otro partido en la misma fecha"
                }
            }
            if((res[i].equipoLocal.toString() === equipoVisitante.toString() || res[i].equipoVisitante.toString() === equipoVisitante.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo visitante ya tiene asigando otro partido en la misma fecha"
                }
            }
            if(res[i].arbitro.toString() === arbitro.toString() && res[i].fecha.getTime() === fecha.getTime()){
                console.log(res[i].arbitro);
                return {error: "El arbitro ya esta asignado a otro partido en esa fecha"}
            }
        }
        return(this.programarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro))
    }

    async programarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro){
        let res = await this.collection.insertOne({
            equipoLocal: equipoLocal,
            equipoVisitante: equipoVisitante,
            fecha: fecha,
            hora: hora,
            estadio: estadio,
            goles: [],
            tarjetas: [],
            incidentes: [],
            resultado: {
                golesEquipoLocal: 0,
                golesEquipoVisitante: 0
            },
            arbitro: arbitro
        })
        return res
    }

    async eliminarPartido(){
        const objEliminar = {
            id: new ObjectId("669ecb5f5e2119f338879a38")
        }
        let {id} = objEliminar

        const partidoExist = await this.collection.findOne({_id : id})
        if(!partidoExist){
            return { error : "El partido no existe"}
        }

        let res = await this.collection.deleteOne(
            { _id: id }
        );
        if(res.acknowledged){
            return {descripcion: "Objeto eliminado con exito"}
        }
    }

    async editarPartido(){
        const objEditar = {
            id: new ObjectId("669ed717e6b7964eb33286de"),
            equipoLocal: new ObjectId("669bd7b50fdab186cea16d79"),
            equipoVisitante: new ObjectId("669bd7b50fdab186cea16d78"),
            fecha: new Date("2024-09-30"),
            hora: "24:00",
            estadio: new ObjectId("669bd1360fdab186cea16d42"),
            arbitro: new ObjectId("669adc5ff75237d05bf6a9d3")

        }
        let {id, equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro} = objEditar

        const partidoExist = await this.collection.findOne({_id : id})
        if(!partidoExist){
            return { error : "El partido no existe"}
        }

        const estadioExist = await this.db.collection('estadios').findOne({_id : estadio})
        if(!estadioExist){
            return { error : "El estadio no existe"}
        }

        const equipoLocalExist = await this.db.collection('equipos').findOne({_id : equipoLocal})
        if(!equipoLocalExist){
            return { error : "El equipo local no existe"}
        }
        const equipoVisExist = await this.db.collection('equipos').findOne({_id : equipoVisitante})
        if(!equipoVisExist){
            return { error : "El equipo visitante no existe"}
        }

        if(equipoLocal.toString() === equipoVisitante.toString()){
            return {error: "Los equipos no pueden ser los mismos"}
        }
        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                hora: 1,
                fecha: 1,
                estadio: 1,
                equipoLocal: 1,
                equipoVisitante: 1,
                arbitro: 1
              }
            }
          ]).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].estadio.toString() === estadio.toString() && res[i].fecha.getTime() === fecha.getTime()){
                return {
                    error: "La fecha y el estadio coinciden con otro partido previamente asignado"
                }
            }
        }

        for (let i = 0; i < res.length; i++) {
            if((res[i].equipoLocal.toString() === equipoLocal.toString() || res[i].equipoVisitante.toString() === equipoLocal.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo local ya tiene asigando otro partido en la misma fecha"
                }
            }
            if((res[i].equipoLocal.toString() === equipoVisitante.toString() || res[i].equipoVisitante.toString() === equipoVisitante.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo visitante ya tiene asigando otro partido en la misma fecha"
                }
            }
            if(res[i].arbitro.toString() === arbitro.toString() && res[i].fecha.getTime() === fecha.getTime()){
                console.log(res[i].arbitro);
                return {error: "El arbitro ya esta asignado a otro partido en esa fecha"}
            }
        }
        res = await this.collection.updateOne(
            {_id : id},
            {
              $set: {
                equipoLocal: equipoLocal,
                equipoVisitante: equipoVisitante,
                fecha: fecha,
                hora: hora,
                estadio: estadio,
                goles: [],
                tarjetas: [],
                incidentes: [],
                resultado: { "golesEquipoLocal": 0, "golesEquipoVisitante": 0 },
                arbitro: arbitro
              }
            }
        )
        if(res.acknowledged){
            return {descripcion: "Objeto actualizado con exito"}
        }
    }

}
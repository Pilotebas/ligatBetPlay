import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class patrocinador extends connect {
    static instance
    constructor() {
        if (typeof patrocinador.instance === "object"){
            return patrocinador.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("patrocinadores");
        patrocinador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    /**
    * Crea un objeto con los detalles de un patrocinador y realiza una validación del mismo.
    * 
    * @returns {Promise<Object>} - El resultado de la validación del patrocinador.
    */

    objetoc11(){
        const obj = {
            nombre: "Hoyy",
            tipo: "principal",
            monto: 18000.500,
            fechaInicio: new Date("2024-01-01"),
            fechaFin: new Date("2024-03-01")
        }
        let {nombre, tipo, monto, fechaInicio, fechaFin} = obj
        return (this.validacionPatrocinador(nombre, tipo, monto, fechaInicio, fechaFin))
    }

    /**
    * Valida los detalles de un patrocinador y verifica si ya existe uno con el mismo nombre.
    * 
    * @param {string} nombre - El nombre del patrocinador.
    * @param {string} tipo - El tipo de patrocinador (e.g., "principal", "secundario").
    * @param {number} monto - El monto del patrocinio.
    * @param {Date} fechaInicio - La fecha de inicio del patrocinio.
    * @param {Date} fechaFin - La fecha de finalización del patrocinio.
    * @returns {Promise<Object>} - Un objeto con un mensaje de error si ya existe un patrocinador con el mismo nombre, o el resultado del registro del patrocinador si la validación es exitosa.
    */

    async validacionPatrocinador(nombre, tipo, monto, fechaInicio, fechaFin){

        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                nombre: 1
              }
            }
        ]).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].nombre === nombre){
                return{descripcion: "Ya existe un patrocinador con el mismo nombre"}
            }
        }
        return(this.registrarPatrocinador(nombre, tipo, monto, fechaInicio, fechaFin))
    }

    /**
    * Registra un nuevo patrocinador en la colección.
    * 
    * @param {string} nombre - El nombre del patrocinador.
    * @param {string} tipo - El tipo de patrocinador (e.g., "principal", "secundario").
    * @param {number} monto - El monto del patrocinio.
    * @param {Date} fechaInicio - La fecha de inicio del patrocinio.
    * @param {Date} fechaFin - La fecha de finalización del patrocinio.
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el patrocinador se registró correctamente.
    */

    async registrarPatrocinador(nombre, tipo, monto, fechaInicio, fechaFin){
        let res = await this.collection.insertOne({
            nombre: nombre,
            tipo: tipo,
            monto: monto,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        })
        if(res.acknowledged){
            return {descripcion: "Objeto agregado con exito"}
        }
    }

    async eliminarPatrocinador(){
        const objEliminar = {
            id: new ObjectId("66a023afc1d4e438bd9f139c")
        }
        let {id} = objEliminar

        const patrocinadorExist = await this.collection.findOne({_id : id})
        if(!patrocinadorExist){
            return { error : "El patrocinador no existe"}
        }

        let res = await this.collection.deleteOne(
            { _id: id }
        );
        if(res.acknowledged){
            return {descripcion: "Patrocinador eliminado con exito"}
        }
    }

    /**
    * Elimina un patrocinador de la colección basado en su ID.
    * 
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el patrocinador se eliminó correctamente, o un mensaje de error si el patrocinador no existe.
    */

    async editarPatrocinador(){
        let objEditar = {
            id : new ObjectId("66a021944115dda00bc8d1d3"),
            nombre: "Hoyy",
            tipo: "principal",
            monto: 18000.780,
            fechaInicio: new Date("2024-01-01"),
            fechaFin: new Date("2024-03-01")
        }
        let {id, nombre, tipo, monto, fechaInicio, fechaFin} = objEditar


        let res = await this.collection.updateOne(
            {_id : id},
            {
              $set: {
                nombre: nombre,
                tipo: tipo,
                monto: monto,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
              }
            }
        )
        if(res.acknowledged){
            return {descripcion: "Patrocinador actualizado con exito"}
        }
    }

}
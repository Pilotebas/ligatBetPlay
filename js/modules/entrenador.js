import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class entrenador extends connect {
    static instance
    constructor() {
        if (typeof entrenador.instance === "object"){
            return entrenador.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("entrenadores");
        entrenador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    /**
    * Crea un objeto con los detalles de un entrenador y realiza una validación del mismo.
    * 
    * @returns {boolean} - El resultado de la validación del entrenador.
    */

    objetoc7(){
        const obj = {
            nombre: "Johan Lo Mama",
            experiencia: "13 años en chupar",
            edad: 18,
            identificacion: 1245678
        }
        let {nombre, experiencia, edad, identificacion} = obj
        return (this.validacionEntrenador(nombre, experiencia, edad, identificacion))
    }

    /**
    * Valida los detalles de un entrenador y verifica si ya está registrado.
    * 
    * @param {string} nombre - El nombre del entrenador.
    * @param {string} experiencia - La experiencia del entrenador.
    * @param {number} edad - La edad del entrenador.
    * @param {number} identificacion - La identificación del entrenador.
    * @returns {Promise<Object>} - Un objeto con un mensaje de error si el entrenador ya está registrado, o el resultado del registro del entrenador si la validación es exitosa.
    */

    async validacionEntrenador(nombre, experiencia, edad, identificacion){

        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                nombre: 1,
                experiencia: 1,
                edad: 1,
                identificacion: 1,
              }
            }
          ]).toArray()
 
        for (let i = 0; i < res.length; i++) {
            if(res[i].identificacion === identificacion){
                return{
                    error: "El entrenador ya esta registrado"
                }
            }
        }
        return(this.registrarEntrenador(nombre, experiencia, edad, identificacion))
    }

    /**
    * Registra un nuevo entrenador en la colección.
    * 
    * @param {string} nombre - El nombre del entrenador.
    * @param {string} experiencia - La experiencia del entrenador.
    * @param {number} edad - La edad del entrenador.
    * @param {number} identificacion - La identificación del entrenador.
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el entrenador se registró correctamente.
    */

    async registrarEntrenador(nombre, experiencia, edad, identificacion){
        let res = await this.collection.insertOne({
            nombre: nombre,
            experiencia: experiencia, 
            edad: edad,
            identificacion: identificacion
        })
        if(res.acknowledged){
            return {descripcion: "Objeto agregado con exito"}
        }
    }

    /**
    * Elimina un entrenador de la colección basado en su ID.
    * 
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el entrenador se eliminó correctamente, o un mensaje de error si el entrenador no existe.
    */

    async eliminarEntrenador(){
        const objEliminar = {
            id: new ObjectId("66a015674bb255d451cdff6d")
        }
        let {id} = objEliminar

        const partidoExist = await this.collection.findOne({_id : id})
        if(!partidoExist){
            return { error : "El entrenador no existe"}
        }

        let res = await this.collection.deleteOne(
            { _id: id }
        );
        if(res.acknowledged){
            return {descripcion: "Entrenador eliminado con exito"}
        }
    }

    /**
    * Edita los detalles de un entrenador existente en la colección.
    * 
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el entrenador se actualizó correctamente, o un mensaje de error si el entrenador no existe o si ya existe un entrenador con la misma identificación.
    */

    async editarEntrenador(){
        let objEditar = {
            id : new ObjectId("669adc98f75237d05bf6a9e0"),
            nombre: "Juan Rivas",
            experiencia: "45 minutos", 
            edad: 20,
            identificacion: 1098609315
        }
        let {id, nombre, experiencia, edad, identificacion} = objEditar

        const entrenadorExist = await this.collection.findOne({_id : id})
        if(!entrenadorExist){
            return { error : "El entrenador no existe"}
        }

        const identificacionExist = await this.db.collection('entrenadores').findOne({identificacion : identificacion})
        if(identificacionExist){
            return { error : "Ya hay un entrenador con la misma identificacion"} 
        }

        let res = await this.collection.updateOne(
            {_id : id},
            {
              $set: {
                nombre: nombre,
                experiencia: experiencia,
                edad: edad,
                identificacion: identificacion
              }
            }
        )
        if(res.acknowledged){
            return {descripcion: "Entrenador actualizado con exito"}
        }
    }

}
import { connect } from "../../helpers/db/connect.js";

export class jugador extends connect {
    static instance
    constructor() {
        if (typeof jugador.instance === "object"){
            return jugador.instance
        }
        super();
        this.collecction = this.db.collection("jugadores");
        jugador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }
    
    // CASO 2
    async addPlayer({nombre,edad,posicion,nacionalidad,numeroCamiseta,equipo,lesiones,rendimientos}) { 
        try {
            this.conexion.connect();
            const equipoExist = await this.db.collection('equipos').findOne({_id : equipo})
            if(!equipoExist){
                return { error : "Equipo no existe"}
            }

            // Validación de número de camiseta
            const jugadorExistente = await this.db.collection('jugadores').findOne({
                equipo: equipo,
                numeroCamiseta: numeroCamiseta
            });
            if (jugadorExistente) {
                return { error: "Ya existe un jugador con ese número de camiseta en el equipo" };
            }
            const newPlayer = {
                nombre: nombre,
                edad: edad,
                posicion: posicion,
                nacionalidad: nacionalidad,
                numeroCamiseta: numeroCamiseta,
                equipo: equipo,  
                lesiones: lesiones,
                rendimientos: rendimientos
            }

            await this.collection.insertOne(newPlayer)
            return {
                success: true,
                message: 'Jugador agregado correctamente',
                data: newPlayer
            }
            }
            catch (error) {
                return {
                    success: false,
                    error_type: error.name || 'Error',
                    error_message: error.message || 'Ha ocurrido un error'
                }
            }   finally{
                this.conexion.close
            }

    } 
    async updatePlayer(teamId, { nombre, edad, posicion, nacionalidad, numeroCamiseta, equipo }) {
        try {
            this.conexion.connect();
            const arrayFilters = [];
            const updateFields = {};

            // Verificar si cada campo está presente y agregar al objeto de actualización
            if (nombre) updateFields.nombre = nombre;
            if (edad) updateFields.edad = edad;
            if (posicion) updateFields.posicion = posicion;
            if (nacionalidad) updateFields.nacionalidad = nacionalidad;
            if (numeroCamiseta) updateFields.numeroCamiseta = numeroCamiseta;
            if (equipo) {
                const equipoExist = await this.db.collection('equipos').findOne({ _id: equipo });
                if (!equipoExist) {
                    return { error: "Equipo no existe" };
                }
                updateFields.equipo = equipo;
            }

            const result = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(teamId) },
                { $set: updateFields },
                { arrayFilters, returnDocument: "after" }
            );

            if (result.modifiedCount === 0) {
                return { error: "jugador no encontrado" };
            }

            return {
                success: true,
                message: 'jugador actualizado correctamente'
            };
        } catch (error) {
        return {
            success: false,
            error_type: error.name || 'Error',
            error_message: error.message || 'Ha ocurrido un error'
        };
        } finally{
            this.conexion.close
        }

    }
    async deletePlayer(teamId){
        try {

            const result = this.collection.findOneAndDelete({_id: new ObjectId(teamId)})

            if (result.modifiedCount === 0) {
                return { error: "jugador no encontrado" };
            }

            return {
                success: true,
                message: 'jugador eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error_message: "jugador no encontrado" 
            };
        }
    }
        
}
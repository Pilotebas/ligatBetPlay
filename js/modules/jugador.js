import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

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
        this.conexion.close()
        return activities
    }
    
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
    async updatePlayer(teamId, { nombre, ciudad, estadio, entrenador, jugadores, partidos, entrenamientos, patrocinadores }) {
        try {
            this.conexion.connect();
            const arrayFilters = [];
            const updateFields = {};

            // Verificar si cada campo está presente y agregar al objeto de actualización
            if (nombre) updateFields.nombre = nombre;
            if (ciudad) updateFields.ciudad = ciudad;
            if (estadio) {
                const estadioExist = await this.db.collection('estadios').findOne({ _id: estadio });
                if (!estadioExist) {
                    return { error: "Estadio no existe" };
                }
                updateFields.estadio = estadio;
            }
            if (entrenador) {
                const entrenadorExist = await this.db.collection('entrenadores').findOne({ _id: entrenador });
                if (!entrenadorExist) {
                    return { error: "Entrenador no existe" };
                }
                updateFields.entrenador = entrenador;
            }
            if (jugadores && jugadores.length > 0) {
                const jugadorId = jugadores[0]; // Asumiendo que solo se envía un ID de jugador
                updateFields["jugadores.$[elem]"] = jugadorId;
                arrayFilters.push({ "elem._id": jugadorId });
            }
            if (partidos && partidos.length > 0) {
                const partidoId = partidos[0]; // Asumiendo que solo se envía un ID de partido
                updateFields["partidos.$[elem]"] = partidoId;
                arrayFilters.push({ "elem._id": partidoId });
            }
            if (patrocinadores && patrocinadores.length > 0) {
                const patrocinadorId = patrocinadores[0];
                updateFields["patrocinadores.$[elem]"] = patrocinadorId;
                arrayFilters.push({ "elem._id": patrocinadorId });
            }

            // Actualización de campos en el objeto entrenamientos
            if (entrenamientos) {
                for (const [key, value] of Object.entries(entrenamientos)) {
                    if (value) { // Solo actualizar si el valor no está vacío
                        updateFields[`entrenamientos.${key}`] = value;
                    }
                }
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
            this.conexion.connect();

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
                success: true,
                error: error_type || 'Error',
                error_message : error_message || 'Error'
            };
        }
    }
        
}
import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class equipo extends connect {
    static instance
    constructor() {
        if (typeof equipo.instance === "object"){
            return equipo.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("equipos");
        equipo.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        this.conexion.close()
        return activities
    }
    async addTeam({nombre,ciudad,estadio,entrenador,jugadores,partidos,entrenamientos,patrocinadores}) { 
        try {
            this.conexion.connect();
            const estadioExist = await this.db.collection('estadios').findOne({_id : estadio})
            if(!estadioExist){
                return { error : "Estadio no existe"}
            }

            const entrenadorExist = await this.db.collection('entrenadores').findOne({_id : entrenador})
            if(!entrenadorExist){
                return { error : "Entrenador no existe"}
            }

            const newTeam = {
                nombre: nombre,
                ciudad: ciudad,
                estadio: estadio,
                entrenador: entrenador,
                jugadores: jugadores,
                partidos: partidos,  
                entrenamientos: entrenamientos,
                patrocinadores: patrocinadores
            }

            await this.collection.insertOne(newTeam)
            return {
                success: true,
                message: 'Equipo agregado correctamente',
                data: newTeam
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
    async updateTeam(teamId, { nombre, ciudad, estadio, entrenador, jugadores, partidos, entrenamientos, patrocinadores }) {
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
                return { error: "Equipo no encontrado" };
            }

            return {
                success: true,
                message: 'Equipo actualizado correctamente'
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
    async deleteTeam(teamId){
        try {
            if(!teamExist) return { error : "Equipo no existe"} 
            const result = await this.collection.findOneAndDelete({_id: new ObjectId(teamId)})
            console.log(result);

            if (result.modifiedCount === 0) {
                return { 
                    error: "Equipo no encontrado",
                 };
            }
            
            return {
                success: true,
                message: 'Equipo eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error_message : 'Equipo no encontrado'
            };
        }
    }
        
}
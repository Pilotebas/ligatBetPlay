import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class equipo extends connect {
    static instance
    constructor() {
        if (typeof equipo.instance === "object"){
            return equipo.instance
        }
        super();
        this.collection = this.db.collection("equipos");
        equipo.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        this.conexion.close()
        return activities
    }

        /**
     * Agrega un nuevo equipo a la base de datos.
     *
     * @async
     * @function addTeam
     * @param {Object} data - Datos del equipo.
     * @param {string} data.nombre - Nombre del equipo.
     * @param {string} data.ciudad - Ciudad del equipo.
     * @param {string} data.estadio - ID del estadio del equipo.
     * @param {string} data.entrenador - ID del entrenador del equipo.
     * @param {string[]} data.jugadores - Array de IDs de los jugadores del equipo.
     * @param {string[]} data.partidos - Array de IDs de los partidos del equipo.
     * @param {Object} data.entrenamientos - Objeto con detalles de los entrenamientos del equipo.
     * @param {string[]} data.patrocinadores - Array de IDs de los patrocinadores del equipo.
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Equipo agregado correctamente").
     * @returns {Object} [result.data] - Datos del equipo agregado (solo en caso de éxito).
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al agregar el equipo, como:
     *   - "Estadio no existe": Si el ID del estadio no es válido.
     *   - "Entrenador no existe": Si el ID del entrenador no es válido.
     *   - Errores relacionados con la base de datos.
     */


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


    /**
     * Actualiza un equipo existente en la base de datos.
     *
     * @async
     * @function updateTeam
     * @param {string} teamId - ID del equipo a actualizar.
     * @param {Object} data - Datos a actualizar.
     * @param {string} [data.nombre] - Nuevo nombre del equipo (opcional).
     * @param {string} [data.ciudad] - Nueva ciudad del equipo (opcional).
     * @param {string} [data.estadio] - Nuevo ID del estadio (opcional).
     * @param {string} [data.entrenador] - Nuevo ID del entrenador (opcional).
     * @param {string[]} [data.jugadores] - Nuevos IDs de jugadores (opcional).
     * @param {string[]} [data.partidos] - Nuevos IDs de partidos (opcional).
     * @param {Object} [data.entrenamientos] - Nuevos datos de entrenamientos (opcional).
     * @param {string[]} [data.patrocinadores] - Nuevos IDs de patrocinadores (opcional).
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Equipo actualizado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al actualizar el equipo, como:
     *   - "Estadio no existe": Si el nuevo ID del estadio no es válido.
     *   - "Entrenador no existe": Si el nuevo ID del entrenador no es válido.
     *   - "Equipo no encontrado": Si el ID del equipo no es válido.
     *   - Errores relacionados con la base de datos.
     */

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
            this.conexion.close()
        }

    }


        /**
     * Elimina un equipo de la base de datos.
     *
     * @async
     * @function deleteTeam
     * @param {string} teamId - ID del equipo a eliminar.
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Equipo eliminado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al eliminar el equipo, como:
     *   - "Equipo no encontrado": Si el ID del equipo no es válido.
     *   - Errores relacionados con la base de datos.
     */
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
import { connect } from "../../helpers/db/connect.js";

export class jugador extends connect {
    static instance
    constructor() {
        if (typeof jugador.instance === "object"){
            return jugador.instance
        }
        super();
        this.collection = this.db.collection("jugadores");
        jugador.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        this.conexion.close()
        return activities
    }
    
    /**
     * Agrega un nuevo jugador a la base de datos.
     *
     * @async
     * @function addPlayer
     * @param {Object} data - Datos del jugador.
     * @param {string} data.nombre - Nombre del jugador.
     * @param {number} data.edad - Edad del jugador.
     * @param {string} data.posicion - Posición del jugador.
     * @param {string} data.nacionalidad - Nacionalidad del jugador.
     * @param {number} data.numeroCamiseta - Número de camiseta del jugador.
     * @param {string} data.equipo - ID del equipo al que pertenece el jugador.
     * @param {Object[]} data.lesiones - Array de objetos con detalles de lesiones del jugador.
     * @param {Object[]} data.rendimientos - Array de objetos con detalles del rendimiento del jugador.
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Jugador agregado correctamente").
     * @returns {Object} [result.data] - Datos del jugador agregado (solo en caso de éxito).
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al agregar el jugador, como:
     *   - "Equipo no existe": Si el ID del equipo no es válido.
     *   - "Ya existe un jugador con ese número de camiseta en el equipo": Si el número de camiseta ya está asignado en el equipo.
     *   - Errores relacionados con la base de datos.
     */
    async addPlayer({nombre,edad,posicion,nacionalidad,numeroCamiseta,equipo,lesiones,rendimientos}) { 
        try {
            this.conexion.connect();
            const equipoExist = await this.db.collection('equipos').findOne({_id : equipo})
            if(!equipoExist){
                return { error : "Equipo no existe"}
            }

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



    /**
     * Actualiza un jugador existente en la base de datos.
     *
     * @async
     * @function updatePlayer
     * @param {string} playerId - ID del jugador a actualizar.
     * @param {Object} data - Datos a actualizar.
     * @param {string} [data.nombre] - Nuevo nombre del jugador (opcional).
     * @param {number} [data.edad] - Nueva edad del jugador (opcional).
     * @param {string} [data.posicion] - Nueva posición del jugador (opcional).
     * @param {string} [data.nacionalidad] - Nueva nacionalidad del jugador (opcional).
     * @param {number} [data.numeroCamiseta] - Nuevo número de camiseta (opcional).
     * @param {string} [data.equipo] - Nuevo ID del equipo (opcional).
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Jugador actualizado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al actualizar el jugador, como:
     *   - "Equipo no existe": Si el nuevo ID del equipo no es válido.
     *   - "Jugador no encontrado": Si el ID del jugador no es válido.
     *   - Errores relacionados con la base de datos.
     */
    async updatePlayer(playerId, { nombre, edad, posicion, nacionalidad, numeroCamiseta, equipo }) {
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
                { _id: new ObjectId(playerId) },
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



    /**
     * Elimina un jugador de la base de datos.
     *
     * @async
     * @function deletePlayer
     * @param {string} playerId - ID del jugador a eliminar.
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Jugador eliminado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al eliminar el jugador, como:
     *   - "Jugador no encontrado": Si el ID del jugador no es válido.
     *   - Errores relacionados con la base de datos.
     */
    async deletePlayer(playerId){
        try {

            const result = this.collection.findOneAndDelete({_id: new ObjectId(playerId)})

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
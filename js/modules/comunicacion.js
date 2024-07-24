import { connect } from "../../helpers/db/connect.js";

export class comunicacion extends connect {
    static instance
    constructor() {
        if (typeof comunicacion.instance === "object"){
            return comunicacion.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("comunicaciones");
        comunicacion.instance = this;
        return this;
    }
        /**
     * Agrega una nueva notificación a la base de datos.
     *
     * @async
     * @function addNotificacion
     * @param {Object} data - Datos de la notificación.
     * @param {string} data.titulo - Título de la notificación.
     * @param {string} data.contenido - Contenido de la notificación.
     * @param {string[]} data.destinatarios - Array de IDs (jugadores, entrenadores, equipos o árbitros) que recibirán la notificación.
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Notificación agregada correctamente").
     * @returns {Object} [result.data] - Datos de la notificación agregada (solo en caso de éxito).
     * @returns {string} [result.error_type] - Tipo de error (solo en caso de error).
     * @returns {string} [result.error_message] - Mensaje de error descriptivo (solo en caso de error).
     * 
     * @throws {Error} - Lanza un error si ocurre un problema al agregar la notificación. Posibles errores incluyen:
     *   - "Destinatario con ID [ID] no encontrado (ni jugador ni equipo)": Si un destinatario no existe.
     *   - Errores relacionados con la base de datos (conexión, validación, etc.).
     */

    async addNotificacion({ titulo, contenido, destinatarios }) {
        try {

            // Validar destinatarios (jugadores y equipos)
            for (const destinatarioId of destinatarios) {
                const destinatario = new ObjectId(destinatarioId); // Convertir a ObjectId
                const jugadorExist = await this.db.collection('jugadores').findOne({ _id: destinatario });
                const equipoExist = await this.db.collection('equipos').findOne({ _id: destinatario });
                const entrenadorExist = await this.db.collection('entrenadores').findOne({ _id: destinatario });
                const arbitroExist = await this.db.collection('arbitros').findOne({ _id: destinatario });
                if (!jugadorExist && !entrenadorExist && !equipoExist && !arbitroExist) {
                    return { error: `Destinatario con ID ${destinatarioId} no encontrado (ni jugador ni equipo)` };
                }
            }

            const newNotificacion = {
                titulo,
                contenido,
                destinatarios: destinatarios.map(id => new ObjectId(id)), // Convertir todos los IDs a ObjectId
                fechaPublicacion: new Date()
            };

            await this.collection.insertOne(newNotificacion);
            return {
                success: true,
                message: 'Notificación agregada correctamente',
                data: newNotificacion
            };
        } catch (error) {
            return {
                success: false,
                error_type: error.name || 'Error',
                error_message: error.message || 'Ha ocurrido un error'
            };
        }
    }

        /**
     * Actualiza una notificación existente en la base de datos.
     *
     * @async
     * @function updateNotificacion
     * @param {string} notificacionId - ID de la notificación a actualizar.
     * @param {Object} data - Datos a actualizar.
     * @param {string} [data.titulo] - Nuevo título (opcional).
     * @param {string} [data.contenido] - Nuevo contenido (opcional).
     * @param {string[]} [data.destinatarios] - Nuevos destinatarios (opcional).
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Notificación actualizada correctamente").
     * @returns {Object} [result.data] - Campos actualizados de la notificación (solo en caso de éxito).
     * @returns {string} [result.error_type] - Tipo de error (solo en caso de error).
     * @returns {string} [result.error_message] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al actualizar la notificación. Posibles errores incluyen:
     *   - "Destinatario con ID [ID] no encontrado (ni jugador ni equipo)": Si un destinatario no existe.
     *   - "Notificación no encontrada": Si el ID de notificación no es válido.
     *   - Errores relacionados con la base de datos (conexión, validación, etc.).
     */

    async updateNotificacion(notificacionId, { titulo, contenido, destinatarios }) {
        try {
            this.conexion.connect();
            const updateFields = {};

            // Validar destinatarios (si se proporcionan)
            if (destinatarios) {
                for (const destinatarioId of destinatarios) {
                    const destinatario = new ObjectId(destinatarioId);
                    const jugadorExist = await this.db.collection('jugadores').findOne({ _id: destinatario });
                    const equipoExist = await this.db.collection('equipos').findOne({ _id: destinatario });
                    const entrenadorExist = await this.db.collection('entrenadores').findOne({ _id: destinatario });
                    const arbitroExist = await this.db.collection('arbitros').findOne({ _id: destinatario });
                    if (!jugadorExist && !entrenadorExist && !equipoExist && !arbitroExist) {
                        return { error: `Destinatario con ID ${destinatarioId} no encontrado (ni jugador ni equipo)` };
                    }
                }
                updateFields.destinatarios = destinatarios.map(id => new ObjectId(id)); // Convertir todos los IDs a ObjectId
            }

            if (titulo) updateFields.titulo = titulo;
            if (contenido) updateFields.contenido = contenido;

            const result = await this.collection.updateOne(
                { _id: new ObjectId(notificacionId) },
                { $set: updateFields }
            );

            if (result.modifiedCount === 0) {
                return { error: "Notificación no encontrada" };
            }

            return {
                success: true,
                message: 'Notificación actualizada correctamente',
                data: updateFields
            };
        } catch (error) {
            return {
                success: false,
                error_type: error.name || 'Error',
                error_message: error.message || 'Ha ocurrido un error'
            };
        } finally {
            this.conexion.close();
        }
    }
}
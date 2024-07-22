import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class comunicacion extends connect {
    static instance
    constructor() {
        if (typeof comunicacion.instance === "object"){
            return comunicacion.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collecction = this.db.collection("comunicaciones");
        comunicacion.instance = this;
        return this;
    }

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
            console.log(newNotificacion);
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

    async updateNotificacion(notificacionId, { titulo, mensaje, destinatarios }) {
        try {
            this.conexion.connect();
            const updateFields = {};

            // Validar destinatarios (si se proporcionan)
            if (destinatarios) {
                for (const destinatarioId of destinatarios) {
                    const destinatario = new ObjectId(destinatarioId);
                    const jugadorExist = await this.db.collection('jugadores').findOne({ _id: destinatario });
                    const equipoExist = await this.db.collection('equipos').findOne({ _id: destinatario });
                    if (!jugadorExist && !equipoExist) {
                        return { error: `Destinatario con ID ${destinatarioId} no encontrado (ni jugador ni equipo)` };
                    }
                }
                updateFields.destinatarios = destinatarios.map(id => new ObjectId(id)); // Convertir todos los IDs a ObjectId
            }

            if (titulo) updateFields.titulo = titulo;
            if (mensaje) updateFields.mensaje = mensaje;

            const result = await this.collection.updateOne(
                { _id: new ObjectId(notificacionId) },
                { $set: updateFields }
            );

            if (result.modifiedCount === 0) {
                return { error: "Notificación no encontrada" };
            }

            return {
                success: true,
                message: 'Notificación actualizada correctamente'
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
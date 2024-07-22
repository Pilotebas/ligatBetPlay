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
        this.conexion.close()
        return activities
    }

    async addResultado(partidoId, { goles, tarjetas, incidentes, resultado }) {
        try {
    
            const partidoExistente = await this.collection.findOne({ _id: new ObjectId(partidoId) });
            if (!partidoExistente) {
                return { error: "Partido no encontrado" };
            }
    
            // Obtener los equipos del partido
            const equipoLocalId = partidoExistente.equipoLocal;
            const equipoVisitanteId = partidoExistente.equipoVisitante;
    
            // Validar y convertir IDs en goles
            for (const gol of goles) {
                gol.id = new ObjectId();
                gol.jugadorGol = new ObjectId(gol.jugadorGol);
                if (gol.jugadorAsistencia) {
                    gol.jugadorAsistencia = new ObjectId(gol.jugadorAsistencia);
                }
    
                const jugadorGol = await this.db.collection('jugadores').findOne({ _id: gol.jugadorGol });
                if (!jugadorGol || (jugadorGol.equipo.toString() !== equipoLocalId.toString() && jugadorGol.equipo.toString() !== equipoVisitanteId.toString())) {
                    return { error: `Jugador que anotó el gol con ID ${gol.jugadorGol} no pertenece a ninguno de los equipos del partido` };
                }
    
                if (gol.jugadorAsistencia) {
                    const jugadorAsistencia = await this.db.collection('jugadores').findOne({ _id: gol.jugadorAsistencia });
                    if (!jugadorAsistencia || (jugadorAsistencia.equipo.toString() !== equipoLocalId.toString() && jugadorAsistencia.equipo.toString() !== equipoVisitanteId.toString())) {
                        return { error: `Jugador que hizo la asistencia con ID ${gol.jugadorAsistencia} no pertenece a ninguno de los equipos del partido` };
                    }
                }
            }
    
            // Validar y convertir IDs en tarjetas
            for (const tarjeta of tarjetas) {
                tarjeta.id = new ObjectId();
                tarjeta.jugador = new ObjectId(tarjeta.jugador);
    
                const jugadorTarjeta = await this.db.collection('jugadores').findOne({ _id: tarjeta.jugador });
                if (!jugadorTarjeta || (jugadorTarjeta.equipo.toString() !== equipoLocalId.toString() && jugadorTarjeta.equipo.toString() !== equipoVisitanteId.toString())) {
                    return { error: `Jugador que recibió la tarjeta con ID ${tarjeta.jugador} no pertenece a ninguno de los equipos del partido` };
                }
            }
    
            // Validar y convertir IDs en incidentes
            for (const incidente of incidentes) {
                incidente.id = new ObjectId();
                incidente.idJugador = new ObjectId(incidente.idJugador);
    
                const jugadorIncidente = await this.db.collection('jugadores').findOne({ _id: incidente.idJugador });
                if (!jugadorIncidente || (jugadorIncidente.equipo.toString() !== equipoLocalId.toString() && jugadorIncidente.equipo.toString() !== equipoVisitanteId.toString())) {
                    return { error: `Jugador involucrado en el incidente con ID ${incidente.idJugador} no pertenece a ninguno de los equipos del partido` };
                }
            }
    
            // Actualizar el resultado del partido
            const updateFields = { goles, tarjetas, incidentes, resultado };
            
            const result = await this.collection.updateOne(
                { _id: new ObjectId(partidoId) },
                { $set: updateFields }
            );
            console.log("ajajaja", result);
            if (result.modifiedCount === 0) {
                return {
                    success: false,
                    error_type: error.name || 'Error',
                    error_message: error.message || 'Ha ocurrido un error'
                };
            }
    
            return {
                success: true,
                message: 'Resultado del partido agregado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error_type: error.name || 'Error',
                error_message: error.message || 'Ha ocurrido un error'
            };
        }
    }
    
    
    
}
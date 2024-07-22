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
                gol.jugadorAsistencia = new ObjectId(gol.jugadorAsistencia)
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
            console.log(updateFields);
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
    async editarResultado(partidoIdString, { goles, tarjetas, incidentes, resultado }) {
        try {
            const partidoId = new ObjectId(partidoIdString);
    
            const partidoExistente = await this.collection.findOne({ _id: partidoId });
            if (!partidoExistente) {
                return { error: "Partido no encontrado" };
            }
    
            // Obtener los equipos del partido
            const equipoLocalId = partidoExistente.equipoLocal;
            const equipoVisitanteId = partidoExistente.equipoVisitante;
    
            const updateFields = {}; // Objeto para almacenar los campos a actualizar
    
            // Validar y actualizar goles (si se proporcionan)
            if (goles) {
                for (const gol of goles) {
                    gol.id = new ObjectId(gol.id); // Convertir id del gol a ObjectId
                    gol.jugadorGol = new ObjectId(gol.jugadorGol);
                    if (gol.jugadorAsistencia) {
                        gol.jugadorAsistencia = new ObjectId(gol.jugadorAsistencia);
                    }
    
                    // Validaciones de jugadores (igual que en addResultado)
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
                updateFields.goles = goles; // Actualizar el array de goles completo
            }
    
            // Validar y actualizar tarjetas (si se proporcionan)
            if (tarjetas) {
                for (const tarjeta of tarjetas) {
                    tarjeta.id = new ObjectId(tarjeta.id);
                    tarjeta.jugador = new ObjectId(tarjeta.jugador);
    
                    // Validaciones de jugadores (igual que en addResultado)
                    const jugadorTarjeta = await this.db.collection('jugadores').findOne({ _id: tarjeta.jugador });
                    if (!jugadorTarjeta || (jugadorTarjeta.equipo.toString() !== equipoLocalId.toString() && jugadorTarjeta.equipo.toString() !== equipoVisitanteId.toString())) {
                        return { error: `Jugador que recibió la tarjeta con ID ${tarjeta.jugador} no pertenece a ninguno de los equipos del partido` };
                    }
                }
                updateFields.tarjetas = tarjetas; // Actualizar el array de tarjetas completo
            }
    
            // Validar y actualizar incidentes (si se proporcionan)
            if (incidentes) {
                for (const incidente of incidentes) {
                    incidente.id = new ObjectId(incidente.id);
                    incidente.idJugador = new ObjectId(incidente.idJugador);
    
                    // Validaciones de jugadores (igual que en addResultado)
                    const jugadorIncidente = await this.db.collection('jugadores').findOne({ _id: incidente.idJugador });
                    if (!jugadorIncidente || (jugadorIncidente.equipo.toString() !== equipoLocalId.toString() && jugadorIncidente.equipo.toString() !== equipoVisitanteId.toString())) {
                        return { error: `Jugador involucrado en el incidente con ID ${incidente.idJugador} no pertenece a ninguno de los equipos del partido` };
                    }
                }
                updateFields.incidentes = incidentes; // Actualizar el array de incidentes completo
            }
    
            // Actualizar resultado (si se proporciona)
            if (resultado) {
                updateFields.resultado = resultado;
            }
    
            const result = await this.collection.updateOne(
                { _id: partidoId },
                { $set: updateFields }
            );
    
            if (result.modifiedCount === 0) {
                return { error: "No se realizaron cambios en el partido" };
            }
    
            return {
                success: true,
                message: 'Resultado del partido actualizado correctamente'
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
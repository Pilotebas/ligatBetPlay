import { connect } from "../../helpers/db/connect.js";

export class partido extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.collecction = this.db.collection("partidos");
        partido.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collecction.find({}).toArray()
        this.conexion.close()
        return activities
    }


    /**
     * Agrega el resultado de un partido a la base de datos.
     *
     * @async
     * @function addResultado
     * @param {string} partidoId - ID del partido al que se agregará el resultado.
     * @param {Object} data - Datos del resultado del partido.
     * @param {Object[]} data.goles - Array de objetos con detalles de los goles (id, jugadorGol, jugadorAsistencia, minuto).
     * @param {Object[]} data.tarjetas - Array de objetos con detalles de las tarjetas (id, jugador, tipo, minuto).
     * @param {Object[]} data.incidentes - Array de objetos con detalles de los incidentes (id, idJugador, tipo, minuto).
     * @param {string} data.resultado - Resultado final del partido (e.g., "2-1").
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Resultado del partido agregado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al agregar el resultado, como:
     *   - "Partido no encontrado": Si el ID del partido no es válido.
     *   - "Jugador que anotó el gol con ID [ID] no pertenece a ninguno de los equipos del partido": Si un jugador involucrado en un gol no es válido.
     *   - "Jugador que hizo la asistencia con ID [ID] no pertenece a ninguno de los equipos del partido": Si un jugador involucrado en una asistencia no es válido.
     *   - "Jugador que recibió la tarjeta con ID [ID] no pertenece a ninguno de los equipos del partido": Si un jugador involucrado en una tarjeta no es válido.
     *   - "Jugador involucrado en el incidente con ID [ID] no pertenece a ninguno de los equipos del partido": Si un jugador involucrado en un incidente no es válido.
     *   - Errores relacionados con la base de datos.
     */
    async addResultado(partidoId, { goles, tarjetas, incidentes, resultado }) {
        try {
    
            const partidoExistente = await this.collection.findOne({ _id: new ObjectId(partidoId) });
            if (!partidoExistente) {
                return { error: "Partido no encontrado" };
            }
    

            const equipoLocalId = partidoExistente.equipoLocal;
            const equipoVisitanteId = partidoExistente.equipoVisitante;
    

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
    

            for (const tarjeta of tarjetas) {
                tarjeta.id = new ObjectId();
                tarjeta.jugador = new ObjectId(tarjeta.jugador);
    
                const jugadorTarjeta = await this.db.collection('jugadores').findOne({ _id: tarjeta.jugador });
                if (!jugadorTarjeta || (jugadorTarjeta.equipo.toString() !== equipoLocalId.toString() && jugadorTarjeta.equipo.toString() !== equipoVisitanteId.toString())) {
                    return { error: `Jugador que recibió la tarjeta con ID ${tarjeta.jugador} no pertenece a ninguno de los equipos del partido` };
                }
            }
    

            for (const incidente of incidentes) {
                incidente.id = new ObjectId();
                incidente.idJugador = new ObjectId(incidente.idJugador);
    
                const jugadorIncidente = await this.db.collection('jugadores').findOne({ _id: incidente.idJugador });
                if (!jugadorIncidente || (jugadorIncidente.equipo.toString() !== equipoLocalId.toString() && jugadorIncidente.equipo.toString() !== equipoVisitanteId.toString())) {
                    return { error: `Jugador involucrado en el incidente con ID ${incidente.idJugador} no pertenece a ninguno de los equipos del partido` };
                }
            }
    

            const updateFields = { goles, tarjetas, incidentes, resultado };
            const result = await this.collection.updateOne(
                { _id: new ObjectId(partidoId) },
                { $set: updateFields }
            );
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



    /**
     * Edita el resultado de un partido existente en la base de datos.
     *
     * @async
     * @function editarResultado
     * @param {string} partidoId - ID del partido a editar.
     * @param {Object} data - Datos actualizados del resultado del partido.
     * @param {Object[]} [data.goles] - Array de objetos con detalles de los goles (id, jugadorGol, jugadorAsistencia, minuto) (opcional).
     * @param {Object[]} [data.tarjetas] - Array de objetos con detalles de las tarjetas (id, jugador, tipo, minuto) (opcional).
     * @param {Object[]} [data.incidentes] - Array de objetos con detalles de los incidentes (id, idJugador, tipo, minuto) (opcional).
     * @param {string} [data.resultado] - Resultado final del partido (e.g., "2-1") (opcional).
     * @returns {Promise<Object>} - Resultado de la operación.
     * @returns {boolean} result.success - Indica si la operación fue exitosa (`true`) o no (`false`).
     * @returns {string} [result.message] - Mensaje de éxito ("Resultado del partido actualizado correctamente").
     * @returns {string} [result.error] - Mensaje de error descriptivo (solo en caso de error).
     *
     * @throws {Error} - Lanza un error si ocurre un problema al editar el resultado, como:
     *   - "Partido no encontrado": Si el ID del partido no es válido.
     *   - Errores similares a los de `addResultado` relacionados con la validación de jugadores.
     *   - "No se realizaron cambios en el partido": Si no se proporcionaron datos para actualizar.
     *   - Errores relacionados con la base de datos.
     */
    async editarResultado(partidoIdString, { goles, tarjetas, incidentes, resultado }) {
        try {
            const partidoId = new ObjectId(partidoIdString);
    
            const partidoExistente = await this.collection.findOne({ _id: partidoId });
            if (!partidoExistente) {
                return { error: "Partido no encontrado" };
            }
    

            const equipoLocalId = partidoExistente.equipoLocal;
            const equipoVisitanteId = partidoExistente.equipoVisitante;
    
            const updateFields = {}; 

            if (goles) {
                for (const gol of goles) {
                    gol.id = new ObjectId(gol.id); 
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
                updateFields.goles = goles; 
            }
    

            if (tarjetas) {
                for (const tarjeta of tarjetas) {
                    tarjeta.id = new ObjectId(tarjeta.id);
                    tarjeta.jugador = new ObjectId(tarjeta.jugador);
    

                    const jugadorTarjeta = await this.db.collection('jugadores').findOne({ _id: tarjeta.jugador });
                    if (!jugadorTarjeta || (jugadorTarjeta.equipo.toString() !== equipoLocalId.toString() && jugadorTarjeta.equipo.toString() !== equipoVisitanteId.toString())) {
                        return { error: `Jugador que recibió la tarjeta con ID ${tarjeta.jugador} no pertenece a ninguno de los equipos del partido` };
                    }
                }
                updateFields.tarjetas = tarjetas; 
            }
    

            if (incidentes) {
                for (const incidente of incidentes) {
                    incidente.id = new ObjectId(incidente.id);
                    incidente.idJugador = new ObjectId(incidente.idJugador);
    

                    const jugadorIncidente = await this.db.collection('jugadores').findOne({ _id: incidente.idJugador });
                    if (!jugadorIncidente || (jugadorIncidente.equipo.toString() !== equipoLocalId.toString() && jugadorIncidente.equipo.toString() !== equipoVisitanteId.toString())) {
                        return { error: `Jugador involucrado en el incidente con ID ${incidente.idJugador} no pertenece a ninguno de los equipos del partido` };
                    }
                }
                updateFields.incidentes = incidentes; 
            }
    

            if (resultado) {
                updateFields.resultado = resultado;
            }
            console.log(updateFields);
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
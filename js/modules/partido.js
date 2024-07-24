import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class partido extends connect {
    static instance
    constructor() {
        if (typeof partido.instance === "object"){
            return partido.instance
        }
        super();
        this.collection = this.db.collection("partidos");
        partido.instance = this;
        return this;
    }

    async getAll() {
        let activities  = await this.collection.find({}).toArray()
        this.conexion.close()
        return activities
    }

    /**
    * Crea un objeto con los detalles de un partido y realiza una validación del mismo.
    * 
    * @returns {boolean} - El resultado de la validación del partido.
    */

    objetoc3(){
        const obj = {
            equipoLocal: new ObjectId("669bd7b50fdab186cea16d79"),
            equipoVisitante: new ObjectId("669bd7b50fdab186cea16d78"),
            fecha: new Date("2024-08-30"),
            hora: "16:00",
            estadio: new ObjectId("669bd1360fdab186cea16d42"),
            arbitro: new ObjectId("669adc5ff75237d05bf6a9d3")
        }
        let {equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro} = obj
        return (this.validacionPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro))
    }

    /**
    * Valida los detalles de un partido y verifica si los equipos, el estadio y el árbitro están disponibles en la fecha y hora especificadas.
    * 
    * @param {ObjectId} equipoLocal - El ID del equipo local.
    * @param {ObjectId} equipoVisitante - El ID del equipo visitante.
    * @param {Date} fecha - La fecha del partido.
    * @param {string} hora - La hora del partido.
    * @param {ObjectId} estadio - El ID del estadio.
    * @param {ObjectId} arbitro - El ID del árbitro.
    * @returns {Promise<Object>} - Un objeto con un mensaje de error si la validación falla, o el resultado de la programación del partido si la validación es exitosa.
    */

    async validacionPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro){

        const estadioExist = await this.db.collection('estadios').findOne({_id : estadio})
        if(!estadioExist){
            return { error : "El estadio no existe"}
        }

        const equipoLocalExist = await this.db.collection('equipos').findOne({_id : equipoLocal})
        if(!equipoLocalExist){
            return { error : "El equipo local no existe"}
        }
        const equipoVisExist = await this.db.collection('equipos').findOne({_id : equipoVisitante})
        if(!equipoVisExist){
            return { error : "El equipo visitante no existe"}
        }

        if(equipoLocal.toString() === equipoVisitante.toString()){
            return {error: "Los equipos no pueden ser los mismos"}
        }
        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                hora: 1,
                fecha: 1,
                estadio: 1,
                equipoLocal: 1,
                equipoVisitante: 1,
                arbitro: 1
              }
            }
          ]).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].estadio.toString() === estadio.toString() && res[i].fecha.getTime() === fecha.getTime()){
                return {
                    error: "La fecha y el estadio coinciden con otro partido previamente asignado"
                }
            }
        }

        for (let i = 0; i < res.length; i++) {
            if((res[i].equipoLocal.toString() === equipoLocal.toString() || res[i].equipoVisitante.toString() === equipoLocal.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo local ya tiene asigando otro partido en la misma fecha"
                }
            }
            if((res[i].equipoLocal.toString() === equipoVisitante.toString() || res[i].equipoVisitante.toString() === equipoVisitante.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo visitante ya tiene asigando otro partido en la misma fecha"
                }
            }
            if(res[i].arbitro.toString() === arbitro.toString() && res[i].fecha.getTime() === fecha.getTime()){
                console.log(res[i].arbitro);
                return {error: "El arbitro ya esta asignado a otro partido en esa fecha"}
            }
        }
        return(this.programarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro))
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
     **/
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
    * Programa un partido insertando los detalles en la colección correspondiente.
    * 
    * @param {ObjectId} equipoLocal - El ID del equipo local.
    * @param {ObjectId} equipoVisitante - El ID del equipo visitante.
    * @param {Date} fecha - La fecha del partido.
    * @param {string} hora - La hora del partido.
    * @param {ObjectId} estadio - El ID del estadio.
    * @param {ObjectId} arbitro - El ID del árbitro.
    * @returns {Promise<Object>} - El resultado de la inserción del partido en la colección.
    */

    async programarPartido(equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro){
        let res = await this.collection.insertOne({
            equipoLocal: equipoLocal,
            equipoVisitante: equipoVisitante,
            fecha: fecha,
            hora: hora,
            estadio: estadio,
            goles: [],
            tarjetas: [],
            incidentes: [],
            resultado: {
                golesEquipoLocal: 0,
                golesEquipoVisitante: 0
            },
            arbitro: arbitro
        })
        return res
    }

    /**
    * Elimina un partido de la colección basado en su ID.
    * 
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el partido se eliminó correctamente, o un mensaje de error si el partido no existe.
    */

    async eliminarPartido(){
        const objEliminar = {
            id: new ObjectId("669ecb5f5e2119f338879a38")
        }
        let {id} = objEliminar

        const partidoExist = await this.collection.findOne({_id : id})
        if(!partidoExist){
            return { error : "El partido no existe"}
        }

        let res = await this.collection.deleteOne(
            { _id: id }
        );
        if(res.acknowledged){
            return {descripcion: "Objeto eliminado con exito"}
        }
    }

    /**
    * Edita los detalles de un partido existente en la colección.
    * 
    * @returns {Promise<Object>} - Un objeto con un mensaje de éxito si el partido se actualizó correctamente, o un mensaje de error si el partido no existe o hay conflictos con la actualización.
    */

    async editarPartido(){
        const objEditar = {
            id: new ObjectId("669ed717e6b7964eb33286de"),
            equipoLocal: new ObjectId("669bd7b50fdab186cea16d79"),
            equipoVisitante: new ObjectId("669bd7b50fdab186cea16d78"),
            fecha: new Date("2024-09-30"),
            hora: "24:00",
            estadio: new ObjectId("669bd1360fdab186cea16d42"),
            arbitro: new ObjectId("669adc5ff75237d05bf6a9d3")

        }
        let {id, equipoLocal, equipoVisitante, fecha, hora, estadio, arbitro} = objEditar

        const partidoExist = await this.collection.findOne({_id : id})
        if(!partidoExist){
            return { error : "El partido no existe"}
        }

        const estadioExist = await this.db.collection('estadios').findOne({_id : estadio})
        if(!estadioExist){
            return { error : "El estadio no existe"}
        }

        const equipoLocalExist = await this.db.collection('equipos').findOne({_id : equipoLocal})
        if(!equipoLocalExist){
            return { error : "El equipo local no existe"}
        }
        const equipoVisExist = await this.db.collection('equipos').findOne({_id : equipoVisitante})
        if(!equipoVisExist){
            return { error : "El equipo visitante no existe"}
        }

        if(equipoLocal.toString() === equipoVisitante.toString()){
            return {error: "Los equipos no pueden ser los mismos"}
        }
        let res = await this.collection.aggregate([
            {
              $project: {
                _id: 0,
                hora: 1,
                fecha: 1,
                estadio: 1,
                equipoLocal: 1,
                equipoVisitante: 1,
                arbitro: 1
              }
            }
          ]).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].estadio.toString() === estadio.toString() && res[i].fecha.getTime() === fecha.getTime()){
                return {
                    error: "La fecha y el estadio coinciden con otro partido previamente asignado"
                }
            }
        }

        for (let i = 0; i < res.length; i++) {
            if((res[i].equipoLocal.toString() === equipoLocal.toString() || res[i].equipoVisitante.toString() === equipoLocal.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo local ya tiene asigando otro partido en la misma fecha"
                }
            }
            if((res[i].equipoLocal.toString() === equipoVisitante.toString() || res[i].equipoVisitante.toString() === equipoVisitante.toString()) && res[i].fecha.getTime() === fecha.getTime()){
                return{
                    error: "El equipo visitante ya tiene asigando otro partido en la misma fecha"
                }
            }
            if(res[i].arbitro.toString() === arbitro.toString() && res[i].fecha.getTime() === fecha.getTime()){
                console.log(res[i].arbitro);
                return {error: "El arbitro ya esta asignado a otro partido en esa fecha"}
            }
        }
        res = await this.collection.updateOne(
            {_id : id},
            {
              $set: {
                equipoLocal: equipoLocal,
                equipoVisitante: equipoVisitante,
                fecha: fecha,
                hora: hora,
                estadio: estadio,
                goles: [],
                tarjetas: [],
                incidentes: [],
                resultado: { "golesEquipoLocal": 0, "golesEquipoVisitante": 0 },
                arbitro: arbitro
              }
            }
        )
        if(res.acknowledged){
            return {descripcion: "Objeto actualizado con exito"}
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
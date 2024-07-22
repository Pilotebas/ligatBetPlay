
import {equipo} from "./js/modules/equipo.js";
import { ObjectId } from "mongodb";
import { jugador } from "./js/modules/jugador.js";
import { partido } from "./js/modules/partido.js";


// Caso 1

//const equipos = new equipo()
// const datosAñadirEquipo = {
//     nombre: 'Equipo A',
//     ciudad: 'Ciudad A',
//     estadio: new ObjectId('669bd1360fdab186cea16d4b'),
//     entrenador: new ObjectId('669adc98f75237d05bf6a9dd'),
//     jugadores: [new ObjectId('669bd1b40fdab186cea16d4c')],
//     partidos: [],  // Lista vacía para partidos
//     entrenamientos: [],  // Lista vacía para entrenamientos
//     patrocinadores: [
//       new ObjectId('669bd2b20fdab186cea16d56'),
//       new ObjectId('669bd2b20fdab186cea16d57')
//     ]
// }
// console.log(await equipos.addTeam(datosAñadirEquipo));

// const datosActualizar = {nombre: 'Equipo A'}
// console.log(await equipos.updateTeam('669bd7b50fdab186cea16d78', datosActualizar));

//console.log(await equipos.deleteTeam('669c03f6bec389f8b97a36c6'));

// caso 2
//const jugadores = new jugador()
//const datosAñadirJugador = {
 // nombre: 'juan Rivas',
 // edad: 12,
  // posicion: "portero",
  // nacionalidad: "mexicano",
  // numeroCamiseta: 100,
  // equipo: new ObjectId('669bd7b50fdab186cea16d78'),  // Lista vacía para partidos
  // lesiones: [],  // Lista vacía para entrenamientos
  // rendimientos: []
//}

//console.log(await jugadores.addPlayer(datosAñadirJugador));

// caso 4 
const partidos = new partido();
const datosAñadirResultado = {
  goles: [
      {  jugadorGol: '669bd1b40fdab186cea16d51', jugadorAsistencia: '669bd1b40fdab186cea16d51', equipo: new ObjectId('669bd7b50fdab186cea16d7c'), minuto: 25 },
      {  jugadorGol: '669bd1b40fdab186cea16d52', jugadorAsistencia: '669bd1b40fdab186cea16d52', equipo: new ObjectId('669bd7b50fdab186cea16d7d'), minuto: 50 }
  ],
  tarjetas: [
      {  jugador: '669bd1b40fdab186cea16d52', tipo: 'amarilla', minuto: 15 },
      {  jugador: '669bd1b40fdab186cea16d52', tipo: 'roja', minuto: 80 }
  ],
  incidentes: [
      { 
          idJugador: '669bd1b40fdab186cea16d52', 
          tipo: 'Falta grave', 
          sancion: 'Tarjeta roja directa', 
          minuto: 80, 
          descripcion: 'El jugador cometió una entrada peligrosa.' 
      }
  ],
  resultado: { golesEquipoLocal: 1, golesEquipoVisitante: 1 }
};
console.log(await partidos.addResultado('669beaad0fdab186cea16d90', datosAñadirResultado));

const datosAEditarResultado = {
  goles: [
      { id: '64d4f141e6450d1a8c26b562', jugadorGol: '64d4f141e6450d1a8c26b564', jugadorAsistencia: '64d4f141e6450d1a8c26b563', equipo: new ObjectId('669bd7b50fdab186cea16d7c'), minuto: 25 },
      { id: '64d4f141e6450d1a8c26b565', jugadorGol: '64d4f141e6450d1a8c26b567', jugadorAsistencia: '64d4f141e6450d1a8c26b563', equipo: new ObjectId('669bd7b50fdab186cea16d7d'), minuto: 50 }
  ],
  tarjetas: [
      { id: '64d4f141e6450d1a8c26b568', jugador: '64d4f141e6450d1a8c26b564', tipo: 'amarilla', minuto: 15 },
      { id: '64d4f141e6450d1a8c26b569', jugador: '64d4f141e6450d1a8c26b567', tipo: 'roja', minuto: 80 }
  ],
  incidentes: [
      { 
          id: '64d4f141e6450d1a8c26b56a', 
          idJugador: '64d4f141e6450d1a8c26b564', 
          tipo: 'Falta grave', 
          sancion: 'Tarjeta roja directa', 
          minuto: 80, 
          descripcion: 'El jugador cometió una entrada peligrosa.' 
      }
  ],
  resultado: { golesEquipoLocal: 1, golesEquipoVisitante: 1 }
};

//console.log(await partidos.editarResultado('669beaad0fdab186cea16d90', datosAEditarResultado));

import {equipo} from "./js/modules/equipo.js";
import { ObjectId } from "mongodb";
import { jugador } from "./js/modules/jugador.js";


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
const jugadores = new jugador()
const datosAñadirJugador = {
  nombre: 'juan Rivas',
  edad: 12,
  posicion: "portero",
  nacionalidad: "mexicano",
  numeroCamiseta: 100,
  equipo: new ObjectId('669bd7b50fdab186cea16d78'),  // Lista vacía para partidos
  lesiones: [],  // Lista vacía para entrenamientos
  rendimientos: []
}

console.log(await jugadores.addPlayer(datosAñadirJugador));
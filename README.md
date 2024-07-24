# LigaBetPlay

La Liga BetPlay es la liga de fútbol profesional de Colombia, que requiere un sistema de gestión integral para administrar todos los aspectos relacionados con la liga, desde la gestión de equipos y jugadores hasta la programación de partidos y la interacción con los aficionados. Actualmente, la gestión de la liga se realiza manualmente o con múltiples sistemas no integrados, lo que genera ineficiencias, errores y dificultades en la toma de decisiones.

El sistema de gestión propuesto debe abordar las siguientes necesidades:

1. **Gestión de Equipos y Jugadores:** El sistema debe permitir registrar, editar y eliminar información de los equipos y jugadores. Esto incluye detalles como nombre, ciudad, estadio, entrenadores, jugadores, y estadísticas individuales y colectivas.
2. **Programación y Resultados de Partidos:** Debe ser posible programar los partidos de la liga, asignando fechas, horarios y estadios. También debe permitir registrar los resultados de los partidos, incluyendo goles, tarjetas y otros incidentes.
3. **Gestión de Lesiones y Rendimiento:** El sistema debe registrar y gestionar las lesiones de los jugadores, así como hacer un seguimiento del rendimiento de los jugadores en cada partido, incluyendo estadísticas como minutos jugados, goles, asistencias y tarjetas.
4. **Entrenamientos y Convocatorias:** Debe permitir a los equipos planificar y registrar sesiones de entrenamiento, así como gestionar las convocatorias de jugadores para partidos y torneos.
5. **Transferencias de Jugadores:** El sistema debe gestionar las transferencias de jugadores entre equipos, incluyendo detalles como equipos de origen y destino, montos y fechas.
6. **Venta de Entradas y Patrocinios:** Debe facilitar la venta de entradas a los aficionados, gestionando las transacciones y asignando asientos en los estadios. También debe gestionar los contratos de patrocinio y publicidad.
7. **Comunicaciones y Relaciones Públicas:** El sistema debe permitir la emisión y gestión de comunicaciones oficiales y noticias de la liga, dirigidas a diferentes actores como aficionados, medios de comunicación y equipos.
8. **Estadísticas y Informes:** Debe proporcionar herramientas para generar y visualizar estadísticas e informes detallados sobre diferentes aspectos de la liga, como rendimiento de equipos y jugadores, asistencia a partidos, etc.
9. **Gestión de Usuarios y Roles:** El sistema debe gestionar los usuarios que acceden al sistema, asignando roles y permisos específicos según su función (administradores, entrenadores, jugadores, periodistas, aficionados).
10. **Seguridad y Acceso:** Debe garantizar la seguridad de la información y el acceso controlado mediante autenticación de usuarios y gestión de permisos.

### Objetivos del Sistema

1. **Centralizar la Gestión:** Unificar la gestión de todos los aspectos de la liga en un único sistema integrado.
2. **Mejorar la Eficiencia:** Reducir los errores y mejorar la eficiencia operativa mediante la automatización de tareas y procesos.
3. **Facilitar la Toma de Decisiones:** Proporcionar información precisa y oportuna para la toma de decisiones estratégicas.
4. **Incrementar la Interacción:** Mejorar la interacción con los aficionados y otros actores mediante una plataforma accesible y funcional.
5. **Asegurar la Información:** Garantizar la seguridad y confidencialidad de la información gestionada por el sistema.

### Clases Principales y Atributos

#### Clase **Equipo**

- `id`: Identificador único del equipo.
- `nombre`: Nombre del equipo.
- `ciudad`: Ciudad de origen del equipo.
- `estadio`: Nombre del estadio donde juega el equipo.
- `entrenador`: Nombre del entrenador del equipo.
- `jugadores`: Lista de jugadores que pertenecen al equipo.
- `partidos`: Lista de partidos en los que ha participado el equipo.
- `Entrenamientos`: Lista de entrenamiento que ha hecho el equipo.
  - `id`: Identificador único del entrenamiento.
  - `equipo`: Equipo que realiza el entrenamiento.
  - `fecha`: Fecha del entrenamiento.
  - `hora`: Hora del entrenamiento.
  - `lugar`: Lugar donde se realiza el entrenamiento.
  - `actividades`: Lista de actividades realizadas durante el entrenamiento.
  - `jugadoresConvocados`: Lista de jugadores convocados para el entrenamiento.


#### Clase **Jugador**

- `id`: Identificador único del jugador.
- `nombre`: Nombre del jugador.
- `edad`: Edad del jugador.
- `posicion`: Posición en la que juega (por ejemplo, delantero, mediocampista, etc.).
- `nacionalidad`: Nacionalidad del jugador.
- `numeroCamiseta`: Número de camiseta del jugador.
- `equipo`: Equipo al que pertenece el jugador.
- `lesiones`: Lista de lesiones que ha tenido el jugador.
  - `id`: Identificador único de la lesión.
  - `tipo`: Tipo de lesión.
  - `gravedad`: Gravedad de la lesión.
  - `fechaInicio`: Fecha de inicio de la lesión.
  - `fechaFin`: Fecha de finalización de la lesión (recuperación).

- `rendimientos`: Lista de registros de rendimiento del jugador.
  - `id`: Identificador único del rendimiento.
  - `partido`: Partido en el que se evaluó el rendimiento.
  - `minutosJugados`: Minutos jugados por el jugador en el partido.
  - `goles`: Número de goles anotados por el jugador en el partido.
  - `asistencias`: Número de asistencias del jugador en el partido.
  - `tarjetasAmarillas`: Número de tarjetas amarillas recibidas por el jugador en el partido.
  - `tarjetasRojas`: Número de tarjetas rojas recibidas por el jugador en el partido.

#### Clase **Partido**

- `id`: Identificador único del partido.
- `equipoLocal`: Equipo que juega como local.
- `equipoVisitante`: Equipo que juega como visitante.
- `fecha`: Fecha del partido.
- `hora`: Hora del partido.
- `estadio`: Estadio donde se juega el partido.
- `goles`: Lista de goles anotados en el partido.
  - `id`: Identificador único del gol.
  - `jugadorGol`: Jugador que anotó el gol.
  - `jugadorAsistencia`: Jugador que hizo asistencia del gol.
  - `equipo`: Equipo que anotó el gol.
  - `minuto`: Minuto en el que se anotó el gol.
- `tarjetas`: Lista de tarjetas (amarillas y rojas) emitidas durante el partido.
  - `id`: Identificador único de la tarjeta.
  - `jugador`: Jugador que recibió la tarjeta.
  - `tipo`: Tipo de tarjeta (amarilla o roja).
  - `minuto`: Minuto en el que se emitió la tarjeta.

- `incidentes`: Lista de incidentes ocurridos durante el partido.
  - `id`: Identificador único del incidente.
  - `idJugador`: Descripción del incidente.
  - `tipo`: Tipo de falta cometida
  - `sancion`: Sanción correspondiente.
  - `minuto`: Minuto en el que ocurrió el incidente.
  - `descripcion`: Minuto en el que ocurrió el incidente.
- `resultado`: Resultado final del partido.
  - `golesEquipoLocal`: Número de goles del equipo local.
  - `golesEquipoVisitante`: Número de goles del equipo visitante.

#### Clase **Actividad**

- `id`: Identificador único de la actividad.
- `descripcion`: Descripción de la actividad.
- `duracion`: Duración de la actividad.

#### Clase **Transferencia**

- `id`: Identificador único de la transferencia.
- `jugador`: Jugador transferido.
- `equipoOrigen`: Equipo del cual proviene el jugador.
- `equipoDestino`: Equipo al cual se transfiere el jugador.
- `monto`: Monto de la transferencia.
- `fecha`: Fecha de la transferencia.

#### Clase **Usuario**

- `id`: Identificador único del usuario.
- `nombre`: Nombre del usuario.
- `email`: Correo electrónico del usuario.
- `password`: Contraseña del usuario.
- `rol`: Rol del usuario (por ejemplo, administrador, entrenador, etc.).

#### Clase **Rol**

- `id`: Identificador único del rol.
- `nombre`: Nombre del rol.
- `permisos`: Lista de permisos asociados al rol.

#### Clase **Permiso**

- `id`: Identificador único del permiso.
- `descripcion`: Descripción del permiso.

#### Clase **Patrocinador**

- `id`: Identificador único del patrocinador.
- `nombre`: Nombre del patrocinador.
- `tipo`: Tipo de patrocinio (por ejemplo, principal, secundario, etc.).
- `monto`: Monto del patrocinio.
- `fechaInicio`: Fecha de inicio del patrocinio.
- `fechaFin`: Fecha de finalización del patrocinio.

#### Clase **Comunicacion**

- `id`: Identificador único de la comunicación.
- `titulo`: Título de la comunicación.
- `contenido`: Contenido de la comunicación.
- `fechaPublicacion`: Fecha de publicación de la comunicación.
- `destinatarios`: Lista de usuarios destinatarios de la comunicación.

#### Clase **Entrada**

- `id`: Identificador único de la entrada.
- `partido`: Partido para el cual es la entrada.
- `comprador`: Usuario que compró la entrada.
- `fechaCompra`: Fecha de compra de la entrada.
- `cantidad`: Cantidad de entradas compradas.
- `precioTotal`: Precio total de la compra.
- `ubicacion`:  id de ubicación de los asientos en el estadio.

#### Clase **Estadio**

- `id`: Identificador único del estadio.
- `nombre`: Nombre del estadio.
- `ubicacion`: Ubicación del estadio.
  - `idubicacion`: Ubicación del estadio.
  - `ubicacion`: Ubicación del estadio.
  - `capacidad`: Capacidad del estadio.

- `capacidad`: Capacidad del estadio.

### Casos de Uso Principales:

#### 1. Gestión de Equipos - 5 SEBAS

**Actor:** Administrador de la Liga
**Descripción:** El administrador puede agregar, editar y eliminar equipos de la liga.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de equipos.
2. El administrador selecciona la opción de agregar equipo.
3. El administrador ingresa la información del equipo (nombre, estadio, ciudad, etc.).
4. El sistema guarda la información del equipo.
5. El administrador puede editar o eliminar equipos existentes.

#### 2. Gestión de Jugadores - 5 SEBAS

**Actor:** Administrador de la Liga, Equipo Técnico
**Descripción:** Permite registrar, editar y eliminar jugadores de los equipos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de jugadores.
2. El actor selecciona la opción de agregar jugador.
3. El actor ingresa la información del jugador (nombre, edad, posición, etc.).
4. El sistema guarda la información del jugador.
5. El actor puede editar o eliminar jugadores existentes.

#### 3. Programación de Partidos -13 RIVAS

**Actor:** Administrador de la Liga
**Descripción:** Permite programar las fechas y horarios de los partidos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de programación de partidos.
2. El administrador selecciona la opción de agregar partido.
3. El administrador selecciona los equipos participantes, la fecha, la hora y el estadio.
4. El sistema guarda la programación del partido.
5. El administrador puede editar o eliminar partidos programados.

```javascript
    //Consulta para devolver datos que necesito e iterarlo
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

    //Consulta para registrar un partido
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

    //Consulta para hacer un update
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
```

#### 4. Registro de Resultados - 3 SEBAS

**Actor:** Árbitro, Administrador de la Liga
**Descripción:** Permite registrar los resultados de los partidos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de registro de resultados.
2. El actor selecciona el partido correspondiente.
3. El actor ingresa el resultado del partido (goles, tarjetas, etc.).
4. El sistema guarda los resultados.
5. El actor puede editar los resultados si es necesario.

#### 5. Visualización de Estadísticas - 5 RIVAS

**Actor:** Aficionado, Periodista, Equipo Técnico
**Descripción:** Permite visualizar estadísticas de jugadores, equipos y partidos.
**Precondiciones:** El usuario debe estar autenticado (para ciertos datos).
**Flujo Principal:**

1. El usuario accede al módulo de estadísticas.
2. El usuario selecciona el tipo de estadísticas que desea visualizar (por jugador, equipo, temporada).
3. El sistema muestra las estadísticas solicitadas.
4. El usuario puede filtrar y ordenar las estadísticas según diferentes criterios.

#### 6. Gestión de Noticias y Comunicados - 3 SEBAS

**Actor:** Administrador de la Liga, Periodista
**Descripción:** Permite publicar y gestionar noticias y comunicados sobre la liga.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de noticias.
2. El actor selecciona la opción de agregar noticia/comunicado.
3. El actor ingresa el contenido de la noticia/comunicado.
4. El sistema publica la noticia/comunicado.
5. El actor puede editar o eliminar noticias/comunicados publicados.

#### 7. Gestión de Entrenadores - 3 RIVAS

**Actor:** Administrador de la Liga, Equipo Técnico
**Descripción:** Permite registrar, editar y eliminar entrenadores de los equipos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de entrenadores.
2. El actor selecciona la opción de agregar entrenador.
3. El actor ingresa la información del entrenador (nombre, experiencia, etc.).
4. El sistema guarda la información del entrenador.
5. El actor puede editar o eliminar entrenadores existentes.

```javascript
    //Consulta para iterarla
    let res = await this.collection.aggregate([
      {
        $project: {
          _id: 0,
          nombre: 1,
          experiencia: 1,
          edad: 1,
          identificacion: 1,
        }
      }
    ]).toArray()

    //Consulta para registrar
    let res = await this.collection.insertOne({
        nombre: nombre,
        experiencia: experiencia, 
        edad: edad,
        identificacion: identificacion
    })

    //Consulta para eliminar
    await this.collection.findOne({_id : id})

    //Consulta para actualizar
    let res = await this.collection.updateOne(
      {_id : id},
      {
        $set: {
          nombre: nombre,
          experiencia: experiencia,
          edad: edad,
          identificacion: identificacion
        }
      }
    )
```

#### 8. Gestión de Árbitros - 3 SEBAS

**Actor:** Administrador de la Liga
**Descripción:** Permite registrar, editar y eliminar árbitros para los partidos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de árbitros.
2. El administrador selecciona la opción de agregar árbitro.
3. El administrador ingresa la información del árbitro (nombre, experiencia, etc.).
4. El sistema guarda la información del árbitro.
5. El administrador puede editar o eliminar árbitros existentes.

#### 9. Gestión de Estadios - 5 SEBAS

**Actor:** Administrador de la Liga
**Descripción:** Permite registrar, editar y eliminar estadios donde se jugarán los partidos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de estadios.
2. El administrador selecciona la opción de agregar estadio.
3. El administrador ingresa la información del estadio (nombre, capacidad, ubicación, etc.).
4. El sistema guarda la información del estadio.
5. El administrador puede editar o eliminar estadios existentes.

#### 10. Venta de Entradas - 13 SEBAS

**Actor:** Aficionado
**Descripción:** Permite a los aficionados comprar entradas para los partidos.
**Precondiciones:** El aficionado debe estar registrado.
**Flujo Principal:**

1. El aficionado accede al módulo de venta de entradas.
2. El aficionado selecciona el partido al que desea asistir.
3. El aficionado selecciona la cantidad de entradas y la ubicación en el estadio.
4. El aficionado realiza el pago.
5. El sistema confirma la compra y emite las entradas electrónicas.

#### 11. Gestión de Patrocinios - 3 RIVAS

**Actor:** Administrador de la Liga
**Descripción:** Permite registrar, editar y eliminar patrocinios de la liga y equipos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de patrocinios.
2. El administrador selecciona la opción de agregar patrocinio.
3. El administrador ingresa la información del patrocinio (empresa, monto, duración, etc.).
4. El sistema guarda la información del patrocinio.
5. El administrador puede editar o eliminar patrocinios existentes.

```javascript
    //Consulta para iterarla
    let res = await this.collection.aggregate([
        {
          $project: {
            _id: 0,
            nombre: 1
          }
        }
    ]).toArray()

    //Consulta para registrar
    let res = await this.collection.insertOne({
        nombre: nombre,
        tipo: tipo,
        monto: monto,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    })

    //Consulta para eliminar
    await this.collection.findOne({_id : id})

    //Consulta para actualizar
    let res = await this.collection.updateOne(
      {_id : id},
      {
        $set: {
          nombre: nombre,
          tipo: tipo,
          monto: monto,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        }
      }
    )
```

#### 12. Generación de Informes - 8 RIVAS

**Actor:** Administrador de la Liga, Equipo Técnico
**Descripción:** Permite generar informes detallados sobre diferentes aspectos de la liga, como rendimiento de equipos, asistencia a partidos, etc.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de generación de informes.
2. El actor selecciona el tipo de informe que desea generar.
3. El sistema recopila la información necesaria y genera el informe.
4. El sistema muestra el informe generado al actor.
5. El actor puede descargar o imprimir el informe.

#### 13. Gestión de Incidentes y Sanciones - 5 SEBAS

**Actor:** Árbitro, Administrador de la Liga
**Descripción:** Permite registrar incidentes ocurridos durante los partidos y aplicar sanciones correspondientes.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de incidentes.
2. El actor selecciona el partido y registra el incidente (tarjetas rojas, comportamientos antideportivos, etc.).
3. El sistema guarda el incidente.
4. El administrador puede revisar los incidentes y aplicar sanciones correspondientes.
5. El sistema notifica las sanciones a los equipos y jugadores involucrados.

#### 14. Consulta de Calendario de Partidos - 8 SEBAS

**Actor:** Aficionado, Periodista, Equipo Técnico
**Descripción:** Permite consultar el calendario de partidos programados en la liga.
**Precondiciones:** Ninguna, aunque algunos datos pueden requerir autenticación.
**Flujo Principal:**

1. El usuario accede al módulo de calendario de partidos.
2. El usuario selecciona la temporada o el rango de fechas que desea consultar.
3. El sistema muestra el calendario de partidos.
4. El usuario puede filtrar los partidos por equipo, estadio, etc.

#### 15. Gestión de Medios de Comunicación

**Actor:** Administrador de la Liga, Periodista
**Descripción:** Permite gestionar las acreditaciones y accesos para medios de comunicación.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de medios.
2. El actor selecciona la opción de agregar medio de comunicación.
3. El actor ingresa la información del medio (nombre, tipo de medio, periodistas acreditados, etc.).
4. El sistema guarda la información del medio.
5. El actor puede editar o eliminar medios de comunicación acreditados.

#### 16. Gestión de Lesiones de Jugadores - 3 RIVAS

**Actor:** Equipo Técnico, Médico del Equipo
**Descripción:** Permite registrar, editar y eliminar información sobre las lesiones de los jugadores.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de lesiones.
2. El actor selecciona la opción de agregar lesión.
3. El actor ingresa la información de la lesión (jugador, tipo de lesión, gravedad, tiempo de recuperación, etc.).
4. El sistema guarda la información de la lesión.
5. El actor puede editar o eliminar registros de lesiones.

#### 17. Gestión de Entrenamientos - 8 RIVAS 

**Actor:** Equipo Técnico
**Descripción:** Permite planificar y registrar las sesiones de entrenamiento de los equipos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El equipo técnico accede al módulo de gestión de entrenamientos.
2. El equipo técnico selecciona la opción de agregar sesión de entrenamiento.
3. El equipo técnico ingresa la información de la sesión (fecha, hora, lugar, actividades, jugadores convocados, etc.).
4. El sistema guarda la información de la sesión.
5. El equipo técnico puede editar o eliminar sesiones de entrenamiento.

#### 18. Seguimiento de Rendimiento de Jugadores - 8 RIVAS

**Actor:** Equipo Técnico
**Descripción:** Permite registrar y consultar el rendimiento de los jugadores durante la temporada.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El equipo técnico accede al módulo de seguimiento de rendimiento.
2. El equipo técnico selecciona al jugador a evaluar.
3. El equipo técnico ingresa datos de rendimiento (partidos jugados, minutos jugados, goles, asistencias, etc.).
4. El sistema guarda la información de rendimiento.
5. El equipo técnico puede consultar y analizar el rendimiento de los jugadores.

#### 19. Gestión de Transferencias de Jugadores - 5 SEBAS

**Actor:** Administrador de la Liga, Equipo Técnico
**Descripción:** Permite registrar y gestionar las transferencias de jugadores entre equipos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de transferencias.
2. El actor selecciona la opción de agregar transferencia.
3. El actor ingresa la información de la transferencia (jugador, equipo de origen, equipo de destino, monto de la transferencia, fecha, etc.).
4. El sistema guarda la información de la transferencia.
5. El actor puede editar o eliminar transferencias registradas.

#### 20. Gestión de Equipamiento

**Actor:** Administrador de la Liga, Equipo Técnico
**Descripción:** Permite gestionar el equipamiento de los equipos, como uniformes y otros materiales deportivos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de gestión de equipamiento.
2. El actor selecciona la opción de agregar equipamiento.
3. El actor ingresa la información del equipamiento (tipo, cantidad, equipo asociado, fecha de adquisición, etc.).
4. El sistema guarda la información del equipamiento.
5. El actor puede editar o eliminar registros de equipamiento.

#### 21. Gestión de Convocatorias de Jugadores

**Actor:** Equipo Técnico
**Descripción:** Permite gestionar las convocatorias de jugadores para partidos y torneos.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El equipo técnico accede al módulo de gestión de convocatorias.
2. El equipo técnico selecciona la opción de agregar convocatoria.
3. El equipo técnico ingresa la información de la convocatoria (partido o torneo, lista de jugadores convocados, fecha, etc.).
4. El sistema guarda la información de la convocatoria.
5. El equipo técnico puede editar o eliminar convocatorias registradas.

#### 23. Gestión de Usuarios y Roles

**Actor:** Administrador de la Liga
**Descripción:** Permite gestionar los usuarios del sistema y asignarles roles y permisos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de usuarios.
2. El administrador selecciona la opción de agregar usuario.
3. El administrador ingresa la información del usuario (nombre, correo electrónico, rol, permisos, etc.).
4. El sistema guarda la información del usuario.
5. El administrador puede editar o eliminar usuarios y sus roles/permisos.

#### 24. Gestión de Patrocinadores y Publicidad

**Actor:** Administrador de la Liga
**Descripción:** Permite gestionar los patrocinadores y contratos de publicidad de la liga y equipos.
**Precondiciones:** El administrador debe estar autenticado.
**Flujo Principal:**

1. El administrador accede al módulo de gestión de patrocinadores.
2. El administrador selecciona la opción de agregar patrocinador.
3. El administrador ingresa la información del patrocinador (nombre, tipo de patrocinio, monto, duración del contrato, etc.).
4. El sistema guarda la información del patrocinador.
5. El administrador puede editar o eliminar patrocinadores y contratos de publicidad.

#### 25. Gestión de Relaciones Públicas

**Actor:** Administrador de la Liga, Periodista
**Descripción:** Permite gestionar las relaciones públicas y comunicaciones oficiales de la liga.
**Precondiciones:** El actor debe estar autenticado.
**Flujo Principal:**

1. El actor accede al módulo de relaciones públicas.
2. El actor selecciona la opción de agregar comunicado.
3. El actor ingresa la información del comunicado (título, contenido, destinatarios, fecha de publicación, etc.).
4. El sistema guarda la información del comunicado.
5. El actor puede editar o eliminar comunicados registrados.

### Relaciones Entre Clases

- **Equipo** tiene una lista de **Jugadores** y **Partidos**.
- **Jugador** está relacionado con **Equipo**, **Lesion**, **Rendimiento**, **Gol**, y **Tarjeta**.
- **Partido** tiene relaciones con **Equipo** (Local y Visitante), **Gol**, **Tarjeta**, **Incidente**, y **Resultado**.
- **Gol**, **Tarjeta**, e **Incidente** están relacionados con **Jugador** y **Partido**.
- **Resultado** está relacionado con **Partido**.
- **Lesion** está relacionada con **Jugador**.
- **Rendimiento** está relacionado con **Jugador** y **Partido**.
- **Entrenamiento** tiene relaciones con **Equipo**, **Actividad**, y **Jugador**.
- **Actividad** está relacionada con **Entrenamiento**.
- **Transferencia** está relacionada con **Jugador**, **Equipo** (Origen y Destino).
- **Usuario** está relacionado con **Rol**.
- **Rol** tiene una lista de **Permisos** y **Usuarios**.
- **Permiso** está relacionado con **Rol**.
- **Patrocinador** está relacionado con **Equipo** y **Liga**.
- **Comunicacion** tiene destinatarios de tipo **Usuario**.
- **Entrada** está relacionada con **Partido** y **Usuario**.
- **Estadio** tiene una lista de **Partidos**.
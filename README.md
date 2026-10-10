# Brain Battle: Juego de trivia para dos jugadores

Aplicación web de trivia en la que dos jugadores se enfrentan por turnos respondiendo preguntas de tres niveles de dificultad. Los puntos ganados se acumulan en el perfil de cada jugador y sirven para desbloquear personajes en la tienda.

## Funcionalidades

- Partidas de **2 jugadores** por turnos, con 15 preguntas por jugador (5 de cada nivel).
- Selección de personaje para cada jugador antes de empezar.
- Sistema de puntuación:
  - **+1 punto** por cada respuesta correcta.
  - **Bono:** 3 respuestas correctas seguidas dan +1 punto extra.
  - **Penalización:** 3 respuestas incorrectas seguidas restan 1 punto.
  - El ganador recibe **+3 puntos** adicionales al terminar la partida.
- Pantalla de ganador con animación de confeti.
- **Tienda** para desbloquear 27 personajes premium con los puntos acumulados (5 personajes vienen desbloqueados).
- Preguntas de Naturaleza, Medio Ambiente, Ciencia, Arte, Literatura e Historia.

## Tecnologías

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, TanStack Query, Wouter
- **Backend:** Node.js, Express 5, TypeScript
- **Validación:** Zod, con contratos de API compartidos entre cliente y servidor
- **Persistencia:** archivos JSON en la carpeta `data`

## Estructura

- `client/`: aplicación React.
  - `src/pages/`: pantallas del juego (inicio, selección de personaje, partida, ganador y tienda).
  - `src/components/ui/`: componentes de interfaz.
  - `public/assets/characters/`: imágenes de los personajes.
- `server/`: servidor Express y API REST.
  - `routes.ts`: endpoints de usuarios, personajes y preguntas.
  - `storage.ts`: lectura y escritura de los archivos JSON.
- `shared/`: esquemas y rutas de la API compartidos entre cliente y servidor.
- `data/`: preguntas, personajes y usuarios.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users/:username` | Consulta un jugador |
| POST | `/api/users` | Crea un jugador (o devuelve el existente) |
| PATCH | `/api/users/:username/points` | Suma puntos a un jugador |
| POST | `/api/users/:username/unlock` | Desbloquea un personaje |
| GET | `/api/characters` | Lista los personajes |
| GET | `/api/questions` | Lista las preguntas |

## Cómo ejecutarlo

1. Tener instalado **Node.js 20** o superior.
2. Instalar las dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

En Windows (PowerShell), el script `dev` usa sintaxis de Linux. Se puede ejecutar así:

```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

4. Abrir http://localhost:5000 en el navegador.

## Equipo

Proyecto desarrollado en equipo.

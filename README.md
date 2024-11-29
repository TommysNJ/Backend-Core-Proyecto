**Backend - Sistema de Gestión de Cursos y Usuarios**

***1. Título del Proyecto:***
Sistema de Gestión de Cursos y Usuarios - Backend

***2. Descripción del Proyecto:***
Este proyecto de backend implementa una API RESTful para gestionar un sistema 
de cursos, usuarios y roles, proporcionando funcionalidades específicas según 
el rol del usuario: alumnos, instructores y administradores. Utiliza Node.js 
como entorno de ejecución, con Express para la creación de rutas y manejo de 
solicitudes, y Sequelize como ORM para interactuar con una base de datos MySQL.
La API permite realizar operaciones CRUD sobre usuarios, cursos, temas, 
subtemáticas y calificaciones, así como gestionar inscripciones y progresos de 
los alumnos en los cursos. Además, el core en el cual se puede generar reportes 
de popularidad de temáticas con filtros y sin filtros, reportes de porcentaje de 
inscripciones en cada temática, y, reportes de subtemáticas más populares por 
instructor. 
Las funcionalidades están estructuradas para que cada tipo de usuario tenga 
permisos específicos, asegurando control de acceso y seguridad.

***3. Tabla de Contenidos***

- Instalación y Ejecución
- Uso del Proyecto
- Rutas y Endpoints
- Roles y Permisos
- Reportes
- Créditos
- Licencia

***4. Instalación y Ejecución del Proyecto***
Para correr este proyecto en tu entorno local, sigue estos pasos:
	1.	Clona el repositorio:
git clone <URL_DEL_REPOSITORIO>
	2.	Instala las dependencias:
npm install
	3.	Configura la Base de Datos:
Asegúrate de que las credenciales de tu base de datos MySQL estén 
configuradas correctamente en el archivo db.js. No olvides especificar el 
nombre de la base de datos, el usuario, la contraseña y el host según tu 
entorno.
	4.	Ejecuta las migraciones y modelos:
Si necesitas crear las tablas en la base de datos desde cero, puedes hacerlo 
a través de las migraciones de Sequelize.
	5.	Inicia el servidor:
npm start
El servidor se ejecutará en http://localhost:8000, y podrás acceder a la API 
a través de las rutas configuradas en el backend.

***5. Uso del Proyecto***
Roles y Permisos:
Cada tipo de usuario (alumno, instructor, administrador) tiene permisos 
específicos para acceder a ciertas rutas y realizar determinadas operaciones. 
Los permisos están estructurados de la siguiente manera:
Alumnos:
- Ver cursos
- Inscribirse
- Registrar su progreso
- Calificar cursos
Instructores:
- Gestionar los cursos que imparten
- Ver y evaluar el progreso de los alumnos inscritos.
Administradores:
- Permisos completos para crear, actualizar y eliminar usuarios, cursos, 
temas y subtemáticas.
- Generar reportes.
- Configurar la administración general del sistema.

***6. Rutas y Endpoints Principales***
Usuarios:
- POST /auth/register: Registro de nuevos usuarios con roles específicos 
(alumno, instructor).
- GET /alumnos: Obtener la lista completa de alumnos.
- GET /instructores: Obtener la lista completa de instructores.
- DELETE /auth/delete/:email: Eliminar un usuario por su email (solo 
administradores).

Cursos:
- GET /cursos: Obtener todos los cursos disponibles.
- POST /cursos: Crear un nuevo curso (solo administradores).
- GET /cursos/:id: Obtener los detalles de un curso específico.
- PUT /cursos/:id: Actualizar los datos de un curso específico.
- DELETE /cursos/:id: Eliminar un curso (solo administradores).

Temas y Subtemáticas:
- GET /temas: Listar todos los temas.
- POST /temas: Crear un tema nuevo.
- PUT /temas/:id: Actualizar un tema específico.
- DELETE /temas/:id: Eliminar un tema.
- GET /subtematicas: Listar todas las subtemáticas.
- POST /subtematicas: Crear una nueva subtemática.
- PUT /subtematicas/:id: Actualizar una subtemática específica.
- DELETE /subtematicas/:id: Eliminar una subtemática.

Autenticación:
El sistema utiliza tokens JWT para autenticar a los usuarios en cada 
solicitud. Los tokens deben incluirse en el encabezado de las solicitudes 
protegidas.

***7. Reportes***
El sistema permite generar diversos reportes útiles para analizar los datos:

Reporte de Popularidad de Temáticas con Calificación:
- Ruta: GET /reports/popularidad-temas
- Muestra las temáticas más populares basadas en inscripciones y 
calificaciones.

Reporte de Porcentaje de Inscripciones por Temática:
- Ruta: GET /reports/porcentaje-inscripciones
- Genera un reporte con el porcentaje de inscripciones por cada temática.

Reporte con Filtros de Calificaciones:
- Ruta: GET /reports/popularidad-temas-filtros
- Permite aplicar filtros de género y rango de edad para analizar 
popularidad y calificaciones de temáticas.

Reporte de Subtemáticas por Instructor:
- Ruta: GET /reports/popularidad-subtematicas-instructor
- Requiere el parámetro email_instructor en la URL.
- Devuelve las subtemáticas más populares impartidas por un instructor 
específico.

Ejemplo de uso en Thunder Client (GET todas las subtematicas):
URL: http://localhost:8000/reports/popularidad-subtematicas-instructor?
email_instructor=correo@ejemplo.com

***8. Créditos***
Este proyecto fue desarrollado por Tomás Núñez Jaramillo, con el objetivo de 
implementar un sistema de gestión de cursos para diferentes tipos de usuarios. 
Se agradece a la comunidad de desarrolladores y recursos en línea que proporcionaron 
inspiración y soporte técnico para la finalización de este proyecto.

***9. Licencia***
Este proyecto está licenciado bajo la Licencia GPL. Esto permite a otros 
usuarios modificar y distribuir el proyecto bajo los mismos términos de la licencia GPL.
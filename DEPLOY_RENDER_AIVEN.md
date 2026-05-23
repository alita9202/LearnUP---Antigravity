# Guía de Despliegue de LearnUp (Aiven MySQL + Render)

Esta guía detalla los pasos para poner en producción el sistema LearnUp, dejando de depender de \`localhost\` y \`XAMPP\`.

## 1. Configuración de Base de Datos en Aiven MySQL

1. Ingresa a tu cuenta de [Aiven](https://console.aiven.io/).
2. Crea un nuevo servicio seleccionando **MySQL**.
3. Una vez creado el servicio, ve a la pestaña **Overview** y copia los siguientes parámetros en "Connection information":
   - **Host** (\`DB_HOST\`)
   - **Port** (\`DB_PORT\`)
   - **User** (\`DB_USER\`)
   - **Password** (\`DB_PASSWORD\`)
4. El nombre de la base de datos por defecto en Aiven suele ser \`defaultdb\`, úsalo como \`DB_NAME\`.

### Ejecutar las Migraciones en Aiven
Dado que Aiven es una base de datos remota, necesitas ejecutar el script inicial para crear las tablas.
1. Utiliza una herramienta cliente como **DBeaver** o **MySQL Workbench**.
2. Conecta con las credenciales de Aiven asegurándote de habilitar **Require SSL**.
3. Abre el archivo \`backend/database/schema.sql\` en el editor SQL de tu herramienta y ejecútalo completamente.
4. (Opcional) Ejecuta el script \`node seed.js\` de manera local asegurándote de tener las credenciales de Aiven en tu \`.env\` local para poblar la BD con datos de prueba.

---

## 2. Configuración Local (.env)

### Backend
Copia el archivo de ejemplo en tu entorno de desarrollo local:
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`
Rellena tu \`backend/.env\` con las credenciales de Aiven y el secreto JWT. Asegúrate de incluir el \`FRONTEND_URL\`, el cual localmente será \`http://localhost:5173\`.

### Frontend
Copia el archivo de ejemplo:
\`\`\`bash
cd frontend
cp .env.example .env
\`\`\`
En desarrollo local, asegúrate de que diga \`VITE_API_URL=http://localhost:5000\`.

---

## 3. Despliegue en Render

### Desplegar el Backend (Node.js/Express)
1. En [Render](https://dashboard.render.com/), crea un nuevo **Web Service**.
2. Conecta tu repositorio de GitHub.
3. Configuración del entorno:
   - **Root Directory:** \`backend\`
   - **Environment:** \`Node\`
   - **Build Command:** \`npm install\`
   - **Start Command:** \`npm start\` (o \`node server.js\`)
4. Ve a **Environment Variables** en Render y añade todas las variables de tu \`backend/.env\`, por ejemplo:
   - \`DB_HOST\` (el host de Aiven)
   - \`DB_USER\`, \`DB_PASSWORD\`, \`DB_NAME\`, \`DB_PORT\`
   - \`JWT_SECRET\` (un string aleatorio seguro)
   - \`FRONTEND_URL\` (la URL que te dará Vercel/Render para tu frontend, ej: \`https://learnup-front.onrender.com\`).
5. Despliega el servicio. Copia la URL pública del backend (ej: \`https://learnup-api.onrender.com\`).

### Desplegar el Frontend (React/Vite)
1. En [Render](https://dashboard.render.com/), crea un **Static Site** o un Web Service (Node) dependiendo de tus preferencias (Vercel es también una excelente opción para el Frontend).
2. Si usas Render Static Site:
   - **Root Directory:** \`frontend\`
   - **Build Command:** \`npm install && npm run build\`
   - **Publish Directory:** \`dist\` (o \`dev-dist\` según tu \`vite.config.js\`)
3. En **Environment Variables**, añade:
   - \`VITE_API_URL\`: *Pega la URL pública del backend desplegado en el paso anterior* (Asegúrate de NO dejar una barra al final \`/\`).
4. En **Redirects/Rewrites** (solo si usas Render Static Site y React Router), añade una regla:
   - **Source:** \`/*\`
   - **Destination:** \`/index.html\`
   - **Action:** \`Rewrite\`
5. ¡Despliega!

## Resumen Final
Al terminar esto, tu frontend se conectará mediante \`VITE_API_URL\` al backend remoto en Render, el cual a su vez leerá y escribirá en tu base de datos de producción MySQL alojada en Aiven, usando SSL activado. ¡Sin XAMPP ni localhost en producción!

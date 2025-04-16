backend creato con express.
database: mongodb
criptazione: bcryptjs
autenticazione: jsonwebtoken
servizi esterni utilizzati: dicebear, cloudinary
rotte: registrazione, login, creazione book post (middleware utenti registrati), 

diagramma applicazione: https://app.eraser.io/workspace/uFSFytuzt8XcRJxBucrn

Per avviare il backend:

1. git clone https://github.com/marcopolello/bookstoreApp.git

2. cd backend
3. npm install

4. creazione file .env

```
esempio: 
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
5. creazione SECRET_KEY da terminale: ```openssl rand -base64 64```
6. registrarsi e accedere su per le variabili d'ambiente ```MONGODB_URI
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET```: 
https://cloud.mongodb.com/
https://cloudinary.com/

7. npm run dev

per avviare il front-end:

1.npm run start
2. se non funziona lanciare il comando: expo start --tunnel


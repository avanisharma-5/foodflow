import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json' assert { type: "json" }; // Import JSON properly

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;

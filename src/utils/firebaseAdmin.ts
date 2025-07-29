import * as admin from "firebase-admin";

import { firebaseServiceAccount } from "./firebase-service-account";


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount as admin.ServiceAccount),
  });
}

export default admin;


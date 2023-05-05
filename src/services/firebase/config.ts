import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class FirebaseConfig {
  private auth: Auth;

  static app: FirebaseApp;
  static storage: FirebaseStorage;

  constructor() {
    const FirebaseApi = {
      apiKey: process.env.FIREBASE_apiKey,
      authDomain: process.env.FIREBASE_authDomain,
      projectId: process.env.FIREBASE_projectId,
      storageBucket: process.env.FIREBASE_storageBucket,
      messagingSenderId: process.env.FIREBASE_messagingSenderId,
      appId: process.env.FIREBASE_appId,
      measurementId: process.env.FIREBASE_measurementId,
    };

    FirebaseConfig.app = initializeApp(FirebaseApi);
    FirebaseConfig.storage = getStorage(FirebaseConfig.app);
    this.auth = getAuth(FirebaseConfig.app);
  }

  async login(): Promise<boolean> {
    const email = process.env.FIREBASE_email ?? '';
    const password = process.env.FIREBASE_password ?? '';

    return await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('Firebase Login: ', userCredential.user.uid);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }


}
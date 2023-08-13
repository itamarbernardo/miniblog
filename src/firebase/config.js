
import { initializeApp  } from 'firebase/app'
// compat packages are API compatible with namespaced code
import { getFirestore } from 'firebase/firestore/lite';


const firebaseConfig = {
  apiKey: "AIzaSyBIgUppd90yHBHI5P8PqBe_ty0Mhl5pzhQ",
  authDomain: "miniblog-a17c4.firebaseapp.com",
  projectId: "miniblog-a17c4",
  storageBucket: "miniblog-a17c4.appspot.com",
  messagingSenderId: "735643922483",
  appId: "1:735643922483:web:1e909df25686ad321d7346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export { db };
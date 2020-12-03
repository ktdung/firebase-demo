import firebase from "firebase/app"

import "firebase/auth"
import "firebase/firestore"
import { firebaseConfig } from "./firebase-config"

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export default firebase
export { db, firebase }

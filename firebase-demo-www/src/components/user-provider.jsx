import React, { createContext, useState, useEffect, useContext } from "react"
import firebase, { db } from "../services/firebase"

const UserContext = createContext({})

export const UserProvider = (props) => {
  const [firestoreUser, setFirestoreUser] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (authState) => {
      const usersCollection = db.collection("users")
      const userSnapshot = await usersCollection.doc(authState.uid).get()
      const user = userSnapshot.data()
      setFirestoreUser({ ...user, uid: authState.uid })
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        firestoreUser,
      }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useFirestoreUser = () => {
  return useContext(UserContext)
}

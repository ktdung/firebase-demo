import { Button, makeStyles, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useFirestoreUser } from "../components/user-provider"
import { db } from "../services/firebase"

const useStyles = makeStyles((theme) => ({
  stuffItem: {
    display: "flex",
    marginBottom: theme.spacing(3),
  },
}))

export const Home = () => {
  const { firestoreUser } = useFirestoreUser()
  const [stuffs, setStuffs] = useState([])
  const [myFavouriteStuffs, setMyFavouritesStuffs] = useState([])
  const [favouriting, setFavouriting] = useState(false)
  const classes = useStyles()

  const getStuff = async () => {
    const stuffCollection = db.collection("stuff")
    const stuffsSnapshot = await stuffCollection.get()
    const stuffs = stuffsSnapshot.docs.map((stuff) => ({ ...stuff.data(), id: stuff.id }))
    setStuffs(stuffs)
  }

  const getFavourites = async () => {
    const favouritesCollection = db.collection("favourites")
    const stuffCollection = db.collection("stuff")

    const userRef = db.collection("users").doc(firestoreUser.uid)
    const favouritesSnapshot = await favouritesCollection.where("userRef", "==", userRef).get()

    const favouriteStuffsIds = favouritesSnapshot.docs.map((favourite) => {
      return favourite.id.split("_")[1]
    })

    const reads = favouriteStuffsIds.map((id) => stuffCollection.doc(id).get())
    const result = await Promise.all(reads)
    const myFavouriteStuffs = result.map((r) => {
      return { ...r.data(), id: r.id }
    })
    console.log(myFavouriteStuffs)

    setMyFavouritesStuffs(myFavouriteStuffs)
  }

  const onFavouriteClick = async (stuff) => {
    setFavouriting(true)
    const favouritesCollection = db.collection("favourites")
    const userRef = db.collection("users").doc(firestoreUser.uid)

    const favouritedStuff = await favouritesCollection.doc(`${firestoreUser.uid}_${stuff.id}`).set({
      userRef: userRef,
    })
    console.log(favouritedStuff)
    setFavouriting(false)
  }

  const onUnfavourite = async (stuff) => {
    const favouritesCollection = db.collection("favourites")
    const deleted = await favouritesCollection.doc(`${firestoreUser.uid}_${stuff.id}`).delete()
    console.log({ deleted })
  }

  useEffect(() => {
    getStuff()
  }, [])

  useEffect(() => {
    if (firestoreUser?.uid) {
      getFavourites()
    }
  }, [firestoreUser?.uid])

  return (
    <div>
      <Typography variant="h3">{favouriting ? "saving to favourites...." : null}</Typography>
      {stuffs.map((stuff) => {
        return (
          <div key={stuff.id} className={classes.stuffItem}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onFavouriteClick(stuff)
              }}>
              Favourite!
            </Button>
            <Typography variant="h5">{stuff.name}</Typography>
          </div>
        )
      })}

      <Typography variant="h3">My Favourites!</Typography>
      {myFavouriteStuffs.map((stuff) => {
        return (
          <div key={stuff.id} className={classes.stuffItem}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onUnfavourite(stuff)
              }}>
              Unfavourite!
            </Button>
            <Typography variant="h5">{stuff.name}</Typography>
          </div>
        )
      })}
    </div>
  )
}

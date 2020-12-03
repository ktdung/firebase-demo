import React, { useState } from "react"
import {
  FormControl,
  makeStyles,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from "@material-ui/core"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import clsx from "clsx"
import firebase, { db } from "../services/firebase"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "350px",
    marginTop: theme.spacing(6),
  },
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
}))

export const Signup = () => {
  const classes = useStyles()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log(userCredentials)

    await db.collection("users").doc(userCredentials.user.uid).set({
      email: userCredentials.user.email,
      emailVerified: userCredentials.user.emailVerified,
      providerId: userCredentials.user.providerId,
    })
    console.log("firestore doc written successfully")
  }

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleFormSubmit}>
        <FormControl className={clsx(classes.formControl)}>
          <TextField
            variant="filled"
            label="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl className={clsx(classes.formControl)}>
          <TextField
            variant="filled"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          SIGNUP
        </Button>
      </form>
    </div>
  )
}

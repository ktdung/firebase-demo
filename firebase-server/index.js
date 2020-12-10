const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { secret } = require("./config")
const mongoOptions = { useUnifiedTopology: true }

const app = express()
const PORT = 8080

app.use(cors())
app.use(bodyParser.json())
app.use(morgan("dev"))

app.get("/hello", (req, res) => {
  const token = req.headers["x-access-token"]

  if (!token) {
    return res.status(401).json({ message: "You are not authorized" })
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(500).json({ message: "something went wrong" })
    console.log({ decoded })
    res.status(200).json({ secretData: "Shhh!" })
  })
})

app.get("/post", async (req, res) => {
  const client = await MongoClient("mongodb://localhost:27017/exercise_1", mongoOptions)
  await client.connect()

  const userId = req.query.userId

  const db = client.db("exercise_1")

  console.log(userId)

  const posts = await db
    .collection("posts")
    .find(userId && { userId: ObjectId(userId) })
    .toArray()

  res.status(200).send({ posts })
})

// 5fca5e811325f5bc0ec5e1e4

app.post("/signup", async (req, res) => {
  const { password, ...user } = req.body

  try {
    const client = await MongoClient("mongodb://localhost:27017/exercise_1", mongoOptions)
    await client.connect()

    const db = client.db("exercise_1")

    const token = jwt.sign({ id: savedUser._id }, secret, {
      expiresIn: 86400,
    })

    res.status(201).json({ email, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

app.post("/login", async (req, res) => {
  const { password, email } = req.body

  try {
    const client = await MongoClient("mongodb://localhost:27017/exercise_1", mongoOptions)
    await client.connect()

    const db = client.db("exercise_1")

    const userFromDb = await db.collection("users").findOne({ email })
    const hash = userFromDb.password

    const passwordCompare = await bcrypt.compare(password, hash)

    if (!userFromDb || !passwordCompare) {
      res.status(403).json({ message: "You are not allowed to enter!" })
      return
    }

    const token = jwt.sign({ id: userFromDb._id }, secret, {
      expiresIn: 86400,
    })

    res.status(200).json({
      user: {
        _id: userFromDb._id,
        email: userFromDb.email,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

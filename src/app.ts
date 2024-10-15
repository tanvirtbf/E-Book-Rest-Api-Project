import express from 'express'

const app = express()

//Routes
app.get('/', (req,res,next)=>{
    res.json({ message : 'Welcome to Elib Api'})
})


export default app
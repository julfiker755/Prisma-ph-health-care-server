import express, { Application,NextFunction,Request,Response} from 'express'
import cors from 'cors'
import router from './app/routes'
import httpStatus from 'http-status'
import globalErrorHander from './app/middlewares/globalErrorHander'
const app:Application = express()
import cookieParser from 'cookie-parser'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



app.get("/",(req:Request,res:Response)=>{
  res.send({
    message:"Ph Health Server is Running.."
  })
})

app.use("/api/v1",router)

app.use(globalErrorHander)

app.use((req:Request,res:Response,next:NextFunction)=>{
  res.status(httpStatus.NOT_FOUND).json({
    success:false,
    message:"API NOT FOUND",
    error:{
      path:req.originalUrl,
      message:"Your Requested path is not found"
    }
  })
})

export default app
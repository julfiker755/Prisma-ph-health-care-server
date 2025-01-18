import { Server } from "http"
import app from "./app"
import config from "./app/config"
import {logger,errorlogger} from "./shared/logger"
import { error } from "console"




async function main() {
   try{
    const server:Server=app.listen(config.port,()=>{
        logger.info(`Server is running ${config.port}`)
     })

    // uncaughtException
     process.on('uncaughtException',(error)=>{
      console.log(error)
      if(server){
         server.close(()=>{
            console.info("Server Close")
         })
      }
      process.exit(1)
     })

   // unhandledRejection
   process.on('unhandledRejection',(error)=>{
      console.log(error)
      if(server){
         server.close(()=>{
            console.info("Server Close")
         })
      }
   process.exit(1)
     })
   }catch(err:any){
    errorlogger.error(err)
   }
}

main()
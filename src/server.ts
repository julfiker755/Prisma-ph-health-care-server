import { Server } from "http"
import app from "./app"
import config from "./app/config"
import {logger,errorlogger} from "./shared/logger"




async function main() {
   try{
    const server:Server=app.listen(config.port,()=>{
        logger.info(`Server is running ${config.port}`)
     })
   }catch(err:any){
    errorlogger.error(err)
   }
}

main()
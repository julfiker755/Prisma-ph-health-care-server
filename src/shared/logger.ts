import path from 'path';
import { createLogger, format, transports } from "winston"
const { combine, timestamp, label, printf,prettyPrint } = format;
import DailyRotateFile from 'winston-daily-rotate-file';

// custom log format
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date= new Date(timestamp as string)
    const hours=date.getHours()
    const minutes=date.getMinutes()
    const seconds=date.getSeconds()
    return `${date.toDateString()} ${hours} ${minutes} ${seconds} [${label}] ${level}: ${message}`;
  });
  

const logger =createLogger({
  level: 'info',
  format: combine(label({ label: 'Info' }),timestamp(),myFormat,prettyPrint()),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
        filename:path.join(process.cwd(),"logs","winston","success","%DATE%.log"),
        datePattern: 'DD-MM-YYYY-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
],
});


const errorlogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'Info' }),timestamp(),myFormat,prettyPrint()),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
        filename:path.join(process.cwd(),"logs","winston","errors","%DATE%.log"),
        datePattern: 'DD-MM-YYYY-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
  ],
});

export {
    logger,
    errorlogger
}






// ****step 1

// import  winston from 'winston';
// import path from 'path';


// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ 
//         filename:path.join(process.cwd(),"logs","winston","success.log"),
//         level: 'info' 
//     }),
// ],
// });


// const errorlogger = winston.createLogger({
//   level: 'error',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ 
//         filename:path.join(process.cwd(),"logs","winston","error.log"),
//         level: 'error'  
//     }),
//   ],
// });

// export {
//     logger,
//     errorlogger
// }




// ** step 2

// import path from 'path';
// import { createLogger, format, transports } from "winston"
// const { combine, timestamp, label, printf,prettyPrint } = format;

// // custom log format
// const myFormat = printf(({ level, message, label, timestamp }) => {

//     const date= new Date(timestamp as string)
//     const hours=date.getHours()
//     const minutes=date.getMinutes()
//     const seconds=date.getSeconds()

//     return `${date.toDateString()} ${hours} ${minutes} ${seconds} [${label}] ${level}: ${message}`;
//   });
  

// const logger =createLogger({
//   level: 'info',
//   format: combine(label({ label: 'Info' }),timestamp(),myFormat,prettyPrint()),
//   transports: [
//     new transports.Console(),
//     new transports.File({ 
//         filename:path.join(process.cwd(),"logs","winston","success.log"),
//         level: 'info' 
//     }),
// ],
// });


// const errorlogger = createLogger({
//   level: 'error',
//   format: combine(label({ label: 'Info' }),timestamp(),myFormat,prettyPrint()),
//   transports: [
//     new transports.Console(),
//     new transports.File({ 
//         filename:path.join(process.cwd(),"logs","winston","error.log"),
//         level: 'error'  
//     }),
//   ],
// });

// export {
//     logger,
//     errorlogger
// }





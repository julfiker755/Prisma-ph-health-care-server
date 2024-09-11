import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.join(process.cwd(),".env")})


export default {
    env:process.env.NODE_ENV,
    port:process.env.PORT,
     jwt:{
        access_token_jwt_secret:process.env.ACCESS_TOKEN_JWT_SECRET,
        access_token_expires_in:process.env.ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_jwt_secret:process.env.REFRESH_TOKEN_JWT_SECRET,
        refresh_token_expires_in:process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_token:process.env.RESET_PASS_TOKEN,
        reset_pass_expires_in:process.env.RESET_PASS_EXPIRES_IN
     },
     reset_pass_link:process.env.RESET_PASS_LINK
}


// pwd <terminal check location>
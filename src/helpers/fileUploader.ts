import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ICloudinaryResponse, IFile } from '../app/interface/file';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(process.cwd(),"uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  // cloud stroage

  cloudinary.config({ 
    cloud_name: 'dzsn9sbjz', 
    api_key: '544878121378184', 
    api_secret: '8P6ZjIhiryAuST55nHEAY1zAshk' // Click 'View API Keys' above to copy your API secret
});

  const uploadToCloudinary = async (file:IFile):Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error:Error, result:ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

  export const fileUploader={
    upload,
    uploadToCloudinary
  }
import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.v2.config({
    cloud_name: 'dswfxy86d',
    api_key: '799124738955252',
    api_secret: 'I2lgHbObVmljRjPdj0i_zCfMHz0'
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


const imageUpload = (file) => {
    return new Promise((resolve, reject) => {
        // if file is a data-url string, use uploader.upload
        if (typeof file === 'string') {
            cloudinary.v2.uploader.upload(file, { resource_type: 'auto' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            return;
        }

        // otherwise assume a buffer-like object was passed
        const stream = cloudinary.v2.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        // if file.buffer exists, end with it, else end with file
        stream.end(file?.buffer || file);
    });
};

export { imageUpload, upload };



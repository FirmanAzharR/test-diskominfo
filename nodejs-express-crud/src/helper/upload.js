const Minio = require('../libraries')('Minio');
const minio = Minio.getInstance().conn;
const BUCKET_NAME = process.env.MINIO_BUCKET;

const uploadMinio = async (file, filename, path) => {
    try {
        await minio.putObject(BUCKET_NAME, path+'/'+filename, file.data, file.size, {'content-type': file.mimetype});
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}


module.exports = {uploadMinio};
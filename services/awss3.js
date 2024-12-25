const AWS= require('aws-sdk');

require('dotenv').config();

exports.uploadToS3= (data, filename) => {
    const BUCKETNAME = process.env.BUCKETNAME;
    const AWSACCESSKEY = process.env.AWSACCESSKEY;
    const AWSSECRETKEY = process.env.AWSSECRETKEY;

    // Initialize S3 client
    let s3bucket = new AWS.S3({
        accessKeyId: AWSACCESSKEY,
        secretAccessKey: AWSSECRETKEY
    });

    // Set the parameters for the S3 upload
    var params = {
        Bucket: BUCKETNAME,
        Key: filename,
        Body: data,  // Image data
        ACL: 'public-read',  // Set public read access (modify if needed)
        //ContentType: contentType,
       // ContentDisposition: 'attachment; filename="' + filename + '"'
    };

    // Return a promise for handling the response asynchronously
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('S3 UPLOAD ERROR');
                console.log(err);
                reject(err);  // Reject if there's an error during upload
                return;
            } else {
                resolve(s3response.Location);  // Resolve the promise with the URL of the uploaded file
            }
        });
    });
}

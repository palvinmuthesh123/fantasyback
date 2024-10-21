const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { getStorage, ref, getDownloadURL } = require('firebase-admin/storage');
const admin = require('firebase-admin');

// const serviceAccount = {
//   type: "service_account",
//   project_id: "dreamelevenclone",
//   private_key_id: process.env.private_key_id,
//   private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDRiGl2H/tn9MYC\nzAUlUUGLm2Z/DhbRMoBSdKglDysu2Wi6ZyV1UcVEnLGgXOwByfIW8G+d1lamRTZ7\nX2AbhxBd7iWPAt00TQl4L5EVoX7b7Lm24T7fKyQTBbll/vMQAhOia6YjFpaXJ2WS\nCMzeuv0hwfwpGic2Srvm5gldMycc976VlQF1ArLb2hBshNUGQE3XTQbffJNNLBFS\nz9z3TjKGxrUkCZnnlzVkBWewVPjB7f7GyH8NOqgPipuXEl3GqfXblrtT7bCoeb5t\nyEC3hybcZIU2DVPGJtsbz09g6eSnMsN3KGN/Sh8Ikayqg67hnJ75lUCJP0UXFUPq\nvIqq8KiJAgMBAAECggEALHE3ETd6XxPTVe+JHd+su9xDsqo927RO9G5K5cVgXuj9\nJiBPmSE1arajlERxSHXZc9Uej4dRTKX8htF1dJFCvvGOpNUyLvAyFHxeVQyyeBov\nT+NZrwMa/S/nIYOgcWJHYNldXS7i1P+lswJL1egqXZkkD2G9NG5IiZJ8JPj/EEz3\nUVPoGID9nFdCDGZpbhgwX85/Zcf6K97ooumaz2hhmQFBKgInOoOBh9xgsE1Jj8Xw\nExCQ1p5EkxZQe3I1mdWr2Fky59iSNo0uIXBXsojYQUuNe9SMqwoCvQMoIRLzX6ut\nWJbn4gLpmFSKoybb8NIjDtdTCz+sbuwdl2K2210suwKBgQD8hMsi0KKc32EfbdO7\nt+4dWbr2JCPyKXvbslVRjfXi95VQiIZbJCJm5FnBAF/C8fJBgEsV6q5Jv6PkY2CH\nxQitxpB9motvv3nMIQxuiUweiZNPYSOLuypll74aeYTfzihGvZpXMGadvy4isRUa\nz02ehbIrRh1L5z9Pdtmm4ALa7wKBgQDUa+jnMGUqsIiy5oCXt6cSdlqGvYMw666U\nWMTqek/1cJZXKu9yk1atHv6GYZ0zJBLWKlQMfKGUrjut6khV6KullTZb6HwU7dYL\nnHWrby9oA3tm9cuiKuO/gRE2mA3tgwHB5uH5GeYQHxL8Pu1UN8Q8IdDMJ/uNkVK6\nJUwI8l4UBwKBgQDaXXdQjvzgDWduh0ne/gpChVLhAZW4FtmNvaR8Fvf4IsOTVcxh\nyliZg4R+GvW0ngcxT2Ee/cdj7P4sRSe3oNKFe719cIR9ySXpOPcIK2CQ08V4knbr\noZnjKppxSH54D03TBqkOFsPWS/n4dAvdGEF2AQV22HYDKmEcNZm37eVqLwKBgQDK\n7LdWu+25RWGhff/Ub/Zj9bpvQ3Wjc1KYluCumt/tuXt1lCegzc4cniJKH9A7vbdc\n7pzSPPFjBrsuXkRyBU6MZSnDzSlUGQzElNf4SMQB2mm1pxO8PLrLBDJ8c+/COMei\nA71V6X7VYcoSPM8eCBQn2aoMjhmKWQytlNm5JkfnWwKBgQDQanav4FXJKIo/ccEH\nx2QyFn0oxMZfrIPkI14ZxfYQ+clswmAjpaHlVn9pGaR1SHGRMFDqpVZj257GyP8K\nwQzImjawr6dki63AwJAFvfuieKo6BY/iTVmGdol7q2UV7eHQLMm64f9QzR3uREW3\nHctnRWqWMnocga/NWBCG/2QiPA==\n-----END PRIVATE KEY-----\n",
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-46oin%40dreamelevenclone.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com"
// };

const serviceAccount = {
  type: "service_account",
  project_id: "dreamelevenclone",
  private_key_id: "38346114064715b48367437c5750a65fc139a66e",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYbXsZKZds5KXY\nf4TyPiA3gjqewLrpMYffO7PPbJzlwauJTfFP/u99nkt+YLLEBRCY4kiJy3IrRmbD\nXd9Bw2dPfldB2QaocoCfsB2wyikIFj3/HeWmc0Rfa3FdfHIhUs8D0YoslTDIEEqL\n6RiDn7JS/rcz+2VQ9u4h07TkL+KHjQVjDpNj5Z/+s3xd/lG8Eiw//yBeVr+jseZb\nHdvS356RNf3+R1UEZTZvnUXyIDxnyuYq7gWUAsITvF8ukBc+aP1Ctl7ISoCSLe/I\nfUOBdMq1vjmBJdRvYJgqd0Yd1aRLQP5UvfeK9Zl2A8hEpxjaKBknG15ANGpAH+1U\npg50OAMvAgMBAAECggEADXqIA5GpChGVWI3ciD+hPwO/xdpH6bT5esgbkyv2+4Ib\nvkHZ6Pr+DEs69WRtTbLpDTRugxJmClbomHs0p8JVIUjDg2jSNtRmuUs9FiEI/CVy\nd/xzLHIaTH0DAuj4rKWdGeZHXi5uas9E7UC3k57y+qM9YqHh9fBi9T1bkyh+SaW7\n391L+uQeJn6sgj53gvfagl/6Gctm9OBgLsGmYs8nLllS0JOeB1sZ/t9etL7DkUx6\nzpxGF+yyBy0iSmNQ27kdmEB4pyhCPjEEqzI0COPf4oI1IcCphQsiWINQQy6FMCwI\ng100P8EOMM5zG7bIIAtQjenzfr8JoKUPhWWQ6PZG5QKBgQDxHin0F0+nJuN8UeuF\npaz9oCf2UkA8VaxjkY4EzyzrbNEfVgDoK5sR8RDiwEqCSiw23YaeQ7G9L6E5BlHO\nmVIvbS6G3Jr2x7MyBsFhK1cPljsAgpH3WXLX5gDJtrTKBBX3+ZR5x1B0RJVKjTjf\n389L4PzZ4ZI27+TZ0WTDtUw5/QKBgQDlyTHHtjQfgQwuh4MNuuxxkNnM00L3ku6l\nHo+MeMwyZ7HJvuwJPvSlY8ZGZeVjTfG43J/nQRaYtB0QbDIpuHDCRSv2LQwvWVAB\nQ3uET2kbCEy1V+gdFKIdfpie7n8Br85PXvl4b3wAyqcaYstH4qRIGcY904ug4Jrn\ntDxJTSmzmwKBgQCghfNqVOaroqFKkANb25va0ngobkPjpyn4s9u36fG+3pgu44QB\nDZ7UiAg03c39BcJ/2GWaEflPuVj9bO6ju8FSX77c/BuS9gqf4I130nHIp7yqL0Nc\nSEnD4JVftWqRH708dQVbOc2fSlWV54UYzpjkrGnJ6Hn+ZyGVvej2vkl8RQKBgELj\nRwdQZWnKQcaFkcN8ZvlD5fJ2iKbScX9FHxoPy7jccGc+mSyz07kVCxFQ9e3rMXLT\nXgSN8Mrwmwk9xXhZhRE3220kfciGogBMKXdBOmIxD0s2VI2qhOo7AKg62mOeTlrS\nVaIWKa19UBkhKvU45wNJ5Wf33UwuNUk/MNFRkdMDAoGAJskYR21/reHcCcVjKwz2\nlj7IiveFzwFhxQGcrT0/rB0LOnx8bmOB2wZkfV5Yv5Uv7yNVr0k3pALjMWvIkiKg\nCSn/VRqPTx/B3ZDTAhDYcLUIuWv1oEq116qGJ4QOoG4YepzOW4tNLfhOy4eJgycg\niEZuGb9SFWVkAvG4698HMDI=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-46oin@dreamelevenclone.iam.gserviceaccount.com",
  client_id: "112825361472499369847",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-46oin%40dreamelevenclone.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'dreamelevenclone.appspot.com'
});
const bucket = admin.storage().bucket();
// Get the downloadUrl for a given file ref
async function uploadImage(id) {
  try {
    // Local path to the image file you want to 
    if (id) {
      const localFilePath = `images/backgroundremoved/${id}.png`;
      // Destination path in Firebase Storage
      const destinationPath = `images/${id}.png`;

      // Upload the image file
     const a= await bucket.upload(localFilePath, {
        destination: destinationPath,
        // You can specify metadata for the file if needed
        metadata: {
          contentType: 'image/jpeg', // Adjust according to your file type
          // You can add more metadata fields as needed
        },
      });

      console.log(a,'Image uploaded successfully.');
      return a
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

// Call the function to upload the image
// uploadImage();
module.exports.uploadImage = uploadImage;
module.exports.db = getFirestore();

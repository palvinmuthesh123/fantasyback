const axios = require("axios");
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
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const MatchLiveDetails = require("../models/matchlive");
const Matches = require("../models/match");
const User = require("../models/user");
const Team = require("../models/team");
const getkeys = require("../utils/crickeys");
const checkballexists = require("../utils/checksame");
const getcommentary = require("../utils/getcommentary");
const db = require("./firebaseinitialize");

// const serviceAccount = {
//   type: "service_account",
//   project_id: "dreamelevenclone",
//   private_key_id: "38346114064715b48367437c5750a65fc139a66e",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYbXsZKZds5KXY\nf4TyPiA3gjqewLrpMYffO7PPbJzlwauJTfFP/u99nkt+YLLEBRCY4kiJy3IrRmbD\nXd9Bw2dPfldB2QaocoCfsB2wyikIFj3/HeWmc0Rfa3FdfHIhUs8D0YoslTDIEEqL\n6RiDn7JS/rcz+2VQ9u4h07TkL+KHjQVjDpNj5Z/+s3xd/lG8Eiw//yBeVr+jseZb\nHdvS356RNf3+R1UEZTZvnUXyIDxnyuYq7gWUAsITvF8ukBc+aP1Ctl7ISoCSLe/I\nfUOBdMq1vjmBJdRvYJgqd0Yd1aRLQP5UvfeK9Zl2A8hEpxjaKBknG15ANGpAH+1U\npg50OAMvAgMBAAECggEADXqIA5GpChGVWI3ciD+hPwO/xdpH6bT5esgbkyv2+4Ib\nvkHZ6Pr+DEs69WRtTbLpDTRugxJmClbomHs0p8JVIUjDg2jSNtRmuUs9FiEI/CVy\nd/xzLHIaTH0DAuj4rKWdGeZHXi5uas9E7UC3k57y+qM9YqHh9fBi9T1bkyh+SaW7\n391L+uQeJn6sgj53gvfagl/6Gctm9OBgLsGmYs8nLllS0JOeB1sZ/t9etL7DkUx6\nzpxGF+yyBy0iSmNQ27kdmEB4pyhCPjEEqzI0COPf4oI1IcCphQsiWINQQy6FMCwI\ng100P8EOMM5zG7bIIAtQjenzfr8JoKUPhWWQ6PZG5QKBgQDxHin0F0+nJuN8UeuF\npaz9oCf2UkA8VaxjkY4EzyzrbNEfVgDoK5sR8RDiwEqCSiw23YaeQ7G9L6E5BlHO\nmVIvbS6G3Jr2x7MyBsFhK1cPljsAgpH3WXLX5gDJtrTKBBX3+ZR5x1B0RJVKjTjf\n389L4PzZ4ZI27+TZ0WTDtUw5/QKBgQDlyTHHtjQfgQwuh4MNuuxxkNnM00L3ku6l\nHo+MeMwyZ7HJvuwJPvSlY8ZGZeVjTfG43J/nQRaYtB0QbDIpuHDCRSv2LQwvWVAB\nQ3uET2kbCEy1V+gdFKIdfpie7n8Br85PXvl4b3wAyqcaYstH4qRIGcY904ug4Jrn\ntDxJTSmzmwKBgQCghfNqVOaroqFKkANb25va0ngobkPjpyn4s9u36fG+3pgu44QB\nDZ7UiAg03c39BcJ/2GWaEflPuVj9bO6ju8FSX77c/BuS9gqf4I130nHIp7yqL0Nc\nSEnD4JVftWqRH708dQVbOc2fSlWV54UYzpjkrGnJ6Hn+ZyGVvej2vkl8RQKBgELj\nRwdQZWnKQcaFkcN8ZvlD5fJ2iKbScX9FHxoPy7jccGc+mSyz07kVCxFQ9e3rMXLT\nXgSN8Mrwmwk9xXhZhRE3220kfciGogBMKXdBOmIxD0s2VI2qhOo7AKg62mOeTlrS\nVaIWKa19UBkhKvU45wNJ5Wf33UwuNUk/MNFRkdMDAoGAJskYR21/reHcCcVjKwz2\nlj7IiveFzwFhxQGcrT0/rB0LOnx8bmOB2wZkfV5Yv5Uv7yNVr0k3pALjMWvIkiKg\nCSn/VRqPTx/B3ZDTAhDYcLUIuWv1oEq116qGJ4QOoG4YepzOW4tNLfhOy4eJgycg\niEZuGb9SFWVkAvG4698HMDI=\n-----END PRIVATE KEY-----\n",
//   client_email:
//     "firebase-adminsdk-46oin@dreamelevenclone.iam.gserviceaccount.com",
//   client_id: "112825361472499369847",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-46oin%40dreamelevenclone.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com",
// };

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "rajeshmn47@gmail.com",
      pass: process.env.password,
    },
  })
);

const mailOptions = {
  from: "rajeshmn47@gmail.com",
  to: "rajeshmn47@gmail.com",
  subject: "Sending Email using Node.js[nodemailer]",
  text: `riyan parag is batting`,
};

//initializeApp({
//credential: cert(serviceAccount),
//});

//const db = getFirestore();
// Add a new document with a generated id.
module.exports.addLivecommentary = async function addcommentry() {
  try {
    let date = new Date();
    let matchess = [];
    const endDate = new Date(date.getTime());
    date = new Date(date.getTime() - 12 * 60 * 60 * 1000);
    const matches = await Matches.find({
      date: {
        $gte: new Date(date),
        $lt: new Date(endDate),
      },
    });

    //  const citiesRef = db.db.collection('commentary');
    //  const snapshot = await citiesRef.get();
    //  if (snapshot.empty) {
    //    console.log('No matching documents.');
    //    return;
    // }
    // snapshot.forEach(async doc => {
    //  console.log(doc.id, '=>', doc.data());
    //  const commentaryRef = db.db.collection("commentary").doc(doc.id);
    //  const res = await commentaryRef.set(
    //    {
    //      commentary: [...doc.data().capital],
    //      livedata: !doc.data().matchdata ? 'not found' : doc.data().matchdata,
    //      miniscore: !doc.data().miniscore ? 'not found' : doc.data().miniscore
    //    },
    //    { merge: true }
    // );
    //});
    for (let i = 0; i < matches.length; i++) {
      const matchid = matches[i].matchId;
      const teams = await Team.find({ matchId: matchid });
      if (teams.length > 0) {
        const match = await MatchLiveDetails.findOne({ matchId: matchid });
        if (match && !(match.result == "Complete")) {
          matchess.push(matches[i]);
        }
      }
    }
    const m = matchess;
    for (let i = 0; i < matchess.length; i++) {
      if (m[i].matchId.length > 3) {
        const keys = await getkeys.getkeys();
        const options = {
          method: "GET",
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${m[i].matchId}/comm`,
          headers: {
            //"X-RapidAPI-Key": 'b9ac58be1fmsh1dc31cbe511d761p103bb8jsn4389ec6b3355',
            //"X-RapidAPI-Key":"f39c66c5a9mshe4e04348c634a6ap1f75edjsn3d3394bd6fc0",
            //"X-RapidAPI-Key":"4725ff9c4dmshd2f385a556069f6p10a2efjsn34ee02dac63e"
            //"X-RapidAPI-Key": "bcb2a1e864msh516fde1e4c87b71p1fd9cfjsna047a0277aa0",
            //"X-RapidAPI-Key": "3a990f059cmsh70cd4953ddaf696p1ac371jsnff076beee96d",
            //"X-RapidAPI-Key":'375b34052emsh67282e5524cc40bp1d3caajsnc0805e37d86e',
            "X-RapidAPI-Key": keys,
            "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
          },
        };
        try {
          const response = await axios.request(options);
          if (response?.data?.commentaryList?.length > 0) {
            const a = response?.data?.commentaryList.reverse();
            const matchdata = response.data.matchHeader;
            const { miniscore } = response.data;
            const commentaryRef = db.db.collection("commentary").doc(m[i].matchId);
            const doc = await commentaryRef.get();
            if (!doc.exists) {
              const commentaryRef = db.db.collection("commentary").doc(m[i].matchId);
              const res = await commentaryRef.set(
                {
                  commentary: [...a],
                  livedata: matchdata,
                  miniscore,
                },
                { merge: true }
              );
            } else {
              const commentaryRef = db.db.collection("commentary").doc(m[i].matchId);
              let xyz = doc.data().commentary;
              let commentary = getcommentary.getcommentary(xyz, a);
              console.log(miniscore?.batsmanStriker?.batId, 'miniscore')
              if (miniscore?.batsmanStriker?.batId == 12305) {
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(`Email sent: ${info.response}`);
                  }
                });
              }
              const res = await commentaryRef.set(
                {
                  commentary: [...commentary],
                  livedata: matchdata,
                  miniscore,
                },
                { merge: true }
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
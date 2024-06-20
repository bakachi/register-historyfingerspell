const admin = require("firebase-admin");
const serviceAccount = require("../creds2.json");

const { default: firebase } = require("firebase/compat/app");
admin.initializeApp({
  credential: "",
  databaseURL: "",
  storageBucket: "",
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { admin, bucket, db };

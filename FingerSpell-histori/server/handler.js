const express = require("express");
const { v4: uuidv4 } = require("uuid");
const upload = require("../middlewares/multer");
const { bucket, db, admin } = require("../services/storeData");
const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    
    const uniqueID = uuidv4();
    const metadata = {
        metadata: {
            firebaseStorageDownloadTokens: uniqueID
        },
        contentType: req.file.mimetype,
        cacheControl: "public, max-age=31414124"
    };

    const blob = bucket.file(uniqueID + "-" + req.file.originalname);
    const blobStream = blob.createWriteStream({
        metadata: metadata,
        gzip: true
    });

    blobStream.on("error", err => {
        return res.status(500).json({ error: "Unable to upload image." });
    });

    blobStream.on("finish", async() => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        await db.collection('images').doc(uniqueID).set({
            imageUrl: imageUrl,
            name: req.file.originalname,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(201).json({ imageUrl });
    });

    blobStream.end(req.file.buffer);
});

module.exports = router;

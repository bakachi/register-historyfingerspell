
const {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { collection, addDoc } = require("firebase/firestore");
const { initFirebase } = require("../services/firebaseConfig");

// Registration handler
const register = async (req, res) => {
  const { email, password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  }

  const { auth, firestore } = initFirebase({
    databaseId: "register", // Use the non-default database ID
  });

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userData = {
      uid: userCredential.user.uid,
      email: email,
    };

    const userRef = await addDoc(collection(firestore, "users"), userData);
    userData.id = userRef.id;

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        uid: userData.uid,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "fail",
      message: "Registration failed",
    });
  }
};

// Google login handler
const loginGoogle = async (req, res) => {
  const { auth, googleProvider } = initFirebase();

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const userCredential = result;
    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: "fail",
      message: "Login failed",
    });
  }
};

// Email login handler
const loginEmail = async (req, res) => {
  const { email, password } = req.body;
  const { auth } = initFirebase();

  if (email && password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = {
        uid: userCredential.user.uid,
        email: email,
      };

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: userData,
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        status: "fail",
        message: "Login failed",
      });
    }
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }
};

module.exports = { register, loginGoogle, loginEmail };

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = "dbIZyFkKffXNurjPApZX15kaRx42";

async function setAdminClaim() {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
      role: "admin"
    });

    console.log("Admin claim added successfully for:", uid);
    process.exit(0);
  } catch (error) {
    console.error("Error setting admin claim:", error);
    process.exit(1);
  }
}

setAdminClaim();

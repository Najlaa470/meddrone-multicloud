const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // si Node <18

admin.initializeApp();

exports.sendIncidentToAzure = functions.database
  .ref("/incidents/{incidentId}")
  .onCreate(async (snapshot, context) => {
    const incident = snapshot.val();
    const incidentId = context.params.incidentId;

    console.log("🔥 Nouvel incident détecté:", incidentId);

    try {
      const response = await fetch(
      "https://fa-urgence-drones-hde5dwf2cdapcyfe.francecentral-01.azurewebsites.net/api/newIncident",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...incident, firebaseId: incidentId }),
        }
      );

      const result = await response.json();
      console.log("✅ Envoyé à Azure:", result);

      await snapshot.ref.update({
        sentToAzure: true,
        azureIncidentId: result.incidentId || null,
        sentAt: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      console.error("❌ Erreur envoi Azure:", error);
      await snapshot.ref.update({ sentToAzure: false, error: error.message });
      throw error;
    }
  });
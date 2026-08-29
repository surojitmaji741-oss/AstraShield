import api from "./api";

export async function getEmergencies() {
  const { data } = await api.get("/emergencies");
  return data;
}

export async function sendSOS(payload) {
  const { data } = await api.post("/emergencies", payload);
  return data;
}

import Emergency from "../models/Emergency.js";

export async function createEmergency(req, res) {
  try {
    const { type, description, severity, location } = req.body;

    const emergency = await Emergency.create({
      type,
      description,
      severity,
      location: {
        latitude: Number(location?.latitude),
        longitude: Number(location?.longitude)
      },
      reportedBy: req.user.id
    });

    const io = req.app.get("io");
    io.emit("emergency:new", emergency);

    res.status(201).json(emergency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listEmergencies(req, res) {
  try {
    const emergencies = await Emergency.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(emergencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateEmergency(req, res) {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!emergency) return res.status(404).json({ message: "Emergency not found" });

    req.app.get("io").emit("emergency:update", emergency);
    res.json(emergency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

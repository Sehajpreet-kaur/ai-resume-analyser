import KV from "../../Models/KvModel.js";

// GET /api/kv/:key
export const getKey = async (req, res) => {
  try {
    const record = await KV.findOne({ owner: req.user._id, key: req.params.key });
    if (!record) return res.status(404).json({ message: "Key not found." });
    res.json({ key: record.key, value: record.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/kv/:key  — upsert
export const setKey = async (req, res) => {
  try {
    const { value, ttlSeconds } = req.body;
    if (value === undefined) return res.status(400).json({ message: "value is required." });

    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;

    const record = await KV.findOneAndUpdate(
      { owner: req.user._id, key: req.params.key },
      { value, expiresAt },
      { upsert: true, new: true }
    );

    res.json({ key: record.key, value: record.value, expiresAt: record.expiresAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/kv/:key
export const deleteKey = async (req, res) => {
  try {
    const result = await KV.findOneAndDelete({ owner: req.user._id, key: req.params.key });
    if (!result) return res.status(404).json({ message: "Key not found." });
    res.json({ message: `Key "${req.params.key}" deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/kv  — list all keys (optionally filter by prefix ?prefix=xxx)
export const listKeys = async (req, res) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.prefix) filter.key = { $regex: `^${req.query.prefix}` };

    const records = await KV.find(filter).select("key value expiresAt -_id");
    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/kv  — flush ALL keys for this user
export const flushKeys = async (req, res) => {
  try {
    const { deletedCount } = await KV.deleteMany({ owner: req.user._id });
    res.json({ message: `${deletedCount} key(s) deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
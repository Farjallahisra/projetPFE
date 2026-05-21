'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbus';
const JWT_SECRET = process.env.JWT_SECRET || 'smartbus-dev-secret-change-in-production';

/* ── Schémas ─────────────────────────────────────────────────── */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: String,
    cinNumber: String,
    role: { type: String, enum: ['superadmin', 'admin', 'parent', 'driver'], default: 'parent' },
  },
  { timestamps: true }
);

const studentSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    classe: String,
    est_present: { type: Boolean, default: false },
    bus_label: String,
  },
  { timestamps: true }
);

const driverSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    telephone: String,
    email: String,
    vehicule: String,
  },
  { timestamps: true }
);

const vehicleSchema = new mongoose.Schema(
  {
    matricule: { type: String, required: true },
    marque: String,
    capacite: mongoose.Schema.Types.Mixed,
    statut: { type: String, default: 'actif' },
  },
  { timestamps: true }
);

const stopSchema = new mongoose.Schema(
  {
    name: String,
    stop_lat: Number,
    stop_lon: Number,
  },
  { timestamps: true }
);

const tripSchema = new mongoose.Schema(
  {
    trip_id: String,
    name: String,
    stops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop' }],
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    type: { type: String, default: 'info' },
    color: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Driver = mongoose.model('Driver', driverSchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Stop = mongoose.model('Stop', stopSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Message = mongoose.model('Message', messageSchema);

/* ── Auth ─────────────────────────────────────────────────────── */
function signToken(user) {
  return jwt.sign({ userId: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Session expirée' });
  }
}

async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    username: 'Administrateur',
    email: 'service.info@emkamed.tn',
    password: hash,
    phoneNumber: '',
    cinNumber: '',
    role: 'admin',
  });

  await User.create({
    username: 'Hanen Miss',
    email: 'Hanen@gmail.com',
    password: hash,
    phoneNumber: '94587124',
    cinNumber: '14078954',
    role: 'parent',
  });

  const students = [
    { nom: 'Issam Abdallah', classe: '3A', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Abir Brahem', classe: '3A', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Ahmed Trabelsi', classe: '4B', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Sara Haddad', classe: '2C', est_present: false, bus_label: 'Bus 001' },
    { nom: 'Oumaima Zaouali', classe: '5A', est_present: false, bus_label: 'Bus 001' },
    { nom: 'Mohamed Salah', classe: '3A', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Fatma Ben Ali', classe: '4B', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Youssef Khelil', classe: '2C', est_present: true, bus_label: 'Bus 001' },
    { nom: 'Leila Mansour', classe: '5A', est_present: false, bus_label: 'Bus 001' },
    { nom: 'Karim Guesmi', classe: '3A', est_present: false, bus_label: 'Bus 001' },
  ];
  await Student.insertMany(students);

  await Driver.insertMany([
    { nom: 'Ali Hajji', telephone: '+216 98 000 001', email: 'ali@ipts.tn', vehicule: 'TU-001-TU' },
    { nom: 'Salem Sellemi', telephone: '+216 98 000 002', email: 'salem@ipts.tn', vehicule: 'TU-002-TU' },
  ]);

  await Vehicle.insertMany([
    { matricule: 'TU-001-TU', marque: 'Mercedes', capacite: 50, statut: 'actif' },
    { matricule: 'TU-002-TU', marque: 'Iveco', capacite: 60, statut: 'actif' },
  ]);

  const stops = await Stop.insertMany([
    { name: 'École', stop_lat: 36.8065, stop_lon: 10.1815 },
    { name: 'Arrêt Centre Ville', stop_lat: 36.812, stop_lon: 10.187 },
    { name: 'Lac 2', stop_lat: 36.818, stop_lon: 10.175 },
    { name: 'Terminus Nord', stop_lat: 36.822, stop_lon: 10.19 },
  ]);

  await Trip.create({
    trip_id: '001',
    name: 'Trajet Matinal',
    stops: stops.map((s) => s._id),
  });

  await Message.insertMany([
    { content: "Bus 001 a quitté l'école à 16:30", type: 'info', color: 'border-blue-500' },
    { content: "Élève Ahmed Trabelsi est monté à l'arrêt Centre Ville", type: 'info', color: 'border-green-500' },
    { content: 'Retard de 5 minutes détecté sur la ligne principale', type: 'warning', color: 'border-orange-500' },
    { content: 'Sara Haddad marquée comme absente', type: 'error', color: 'border-red-500' },
    { content: 'Bus 1 en retard (15 min)', type: 'error', color: 'border-red-500' },
  ]);

  // eslint-disable-next-line no-console
  console.log('[seed] Base initialisée (admin: service.info@emkamed.tn / admin123)');
}

/* ── App ─────────────────────────────────────────────────────── */
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post('/api/session', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = signToken(user);
    const u = user.toObject();
    delete u.password;
    return res.json({
      ...u,
      email: user.email,
      role: user.role,
      token: { data: token },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.use('/api', authMiddleware);

app.get('/api/users', async (req, res) => {
  const { role } = req.query;
  const q = role ? { role } : {};
  const users = await User.find(q).select('-password').lean();
  res.json({ users });
});

app.post('/api/users', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.password) return res.status(400).json({ message: 'Mot de passe requis' });
    const hash = await bcrypt.hash(body.password, 10);
    const doc = await User.create({
      ...body,
      email: (body.email || '').trim().toLowerCase(),
      password: hash,
    });
    const u = doc.toObject();
    delete u.password;
    res.status(201).json(u);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'Email déjà utilisé' });
    res.status(400).json({ message: e.message || 'Erreur' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.password) body.password = await bcrypt.hash(body.password, 10);
    else     delete body.password;
    const doc = await User.findByIdAndUpdate(req.params.id, body, { new: true }).select('-password');
    if (!doc) return res.status(404).json({ message: 'Introuvable' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message || 'Erreur' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find().lean();
  res.json({ students });
});

app.get('/api/drivers', async (req, res) => {
  const drivers = await Driver.find().lean();
  res.json({ drivers });
});

app.post('/api/drivers', async (req, res) => {
  const d = await Driver.create(req.body);
  res.status(201).json(d);
});

app.put('/api/drivers/:id', async (req, res) => {
  const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!d) return res.status(404).json({ message: 'Introuvable' });
  res.json(d);
});

app.delete('/api/drivers/:id', async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find().lean();
  res.json({ vehicles });
});

app.post('/api/vehicles', async (req, res) => {
  const v = await Vehicle.create(req.body);
  res.status(201).json(v);
});

app.put('/api/vehicles/:id', async (req, res) => {
  const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!v) return res.status(404).json({ message: 'Introuvable' });
  res.json(v);
});

app.delete('/api/vehicles/:id', async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/stops', async (req, res) => {
  const stops = await Stop.find().lean();
  res.json({ stops });
});

app.get('/api/trips', async (req, res) => {
  const trips = await Trip.find().populate('stops').lean();
  const shaped = trips.map((t) => ({
    ...t,
    stops: (t.stops || []).map((s) => ({
      ...s,
      latitude: s.stop_lat,
      longitude: s.stop_lon,
    })),
  }));
  res.json({ trips: shaped });
});

app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ messages });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  // eslint-disable-next-line no-console
  console.log('[mongo] connecté :', MONGODB_URI);
  await seedIfEmpty();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

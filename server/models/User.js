import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "user"], default: 'user' },
    image: { type: String, default: '' },
    phone: { type: String, default: '0000000000' },
    address: { type: String, default: 'Not Selected' },
    dob: { type: String, default: 'Not Selected' },
    gender: { type: String, default: 'Not Selected' },
    nationality: { type: String, default: 'Not Selected' },
    idNumber: { type: String, default: 'Not Selected' },
    emergencyContact: { type: String, default: 'Not Selected' },
    job: { type: String, default: 'Not Selected' },
    licenseNumber: { type: String, default: 'Not Selected' },
    licenseExpiry: { type: String, default: 'Not Selected' },
    city: { type: String, default: 'Not Selected' },
    zipCode: { type: String, default: 'Not Selected' },
    country: { type: String, default: 'Not Selected' },
    idCardFront: { type: String, default: '' },
    idCardBack: { type: String, default: '' },
    wallet: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User
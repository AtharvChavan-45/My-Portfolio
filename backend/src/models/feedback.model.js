import mongoose, { Schema } from 'mongoose';

const replySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: [
            'student',
            'company_representative',
            'hiring_manager_recruiter',
            'client',
            'developer_professional',
            'other'
        ]
    },
    company: {
        name: String,
        designation: String,
        website: String
    },
    opportunity: {
        type: { type: String }, // 'type' needs a nested definition in schema since it's a reserved word
        position: String,
        jobType: String,
        link: String
    },
    studentDetails: {
        school: String,
        degree: String,
        specialization: String,
        gradYear: String,
        interestArea: String
    },
    clientDetails: {
        organization: String,
        projectType: String,
        timeline: String,
        description: String
    },
    developerDetails: {
        organization: String,
        expertise: String,
        reason: String
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    contactPermission: {
        type: Boolean,
        default: false
    },
    replies: [replySchema]
}, {
    timestamps: true
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);

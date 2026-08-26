import { Feedback } from '../models/feedback.model.js';
import nodemailer from 'nodemailer';

// Submit feedback (Public)
export const submitFeedback = async (req, res) => {
    try {
        const { name, email, role, message, rating, contactPermission, company, opportunity, studentDetails, clientDetails, developerDetails } = req.body;

        if (!name || !email || !role || !message) {
            return res.status(400).json({ success: false, message: "Required fields: name, email, role, and message." });
        }

        // Initialize feedback payload
        const feedbackPayload = {
            name,
            email,
            role,
            message,
            rating: rating ? Number(rating) : undefined,
            contactPermission: !!contactPermission
        };

        // Dynamically add fields based on role
        if (role === 'student' && studentDetails) {
            feedbackPayload.studentDetails = studentDetails;
        } else if ((role === 'company_representative' || role === 'hiring_manager_recruiter')) {
            if (company) feedbackPayload.company = company;
            if (opportunity) feedbackPayload.opportunity = opportunity;
        } else if (role === 'client' && clientDetails) {
            feedbackPayload.clientDetails = clientDetails;
        } else if (role === 'developer_professional' && developerDetails) {
            feedbackPayload.developerDetails = developerDetails;
        }

        const newFeedback = await Feedback.create(feedbackPayload);

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully!",
            data: newFeedback
        });
    } catch (error) {
        console.error("Submit feedback error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Get all feedback (Admin - Protected)
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        console.error("Get all feedback error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Send reply to visitor (Admin - Protected)
export const sendReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ success: false, message: "Reply message cannot be empty." });
        }

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        // Configure Nodemailer transporter (check env variables)
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = process.env.SMTP_PORT || 587;
        const smtpUser = process.env.SMTP_USER || '';
        const smtpPass = process.env.SMTP_PASS || '';

        let emailSentStatus = "Logged (no credentials)";
        
        if (smtpUser && smtpPass) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: Number(smtpPort),
                    secure: Number(smtpPort) === 465,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                const mailOptions = {
                    from: `"Portfolio Admin" <${smtpUser}>`,
                    to: feedback.email,
                    subject: `Re: Portfolio Feedback - Response from Atharv Chavan`,
                    text: `Hello ${feedback.name},\n\nThank you for reaching out through my portfolio website as a ${feedback.role.replace('_', ' ')}.\n\nHere is my response:\n${message}\n\nBest regards,\nAtharv Chavan\nComputer Science Engineering Student\nRajarambapu Institute of Technology`,
                    html: `
                        <p>Hello ${feedback.name},</p>
                        <p>Thank you for reaching out through my portfolio website as a <strong>${feedback.role.replace('_', ' ')}</strong>.</p>
                        <p>Here is my response:</p>
                        <blockquote style="border-left: 3px solid #aa3bff; padding-left: 10px; margin: 15px 0; color: #555;">
                            ${message.replace(/\n/g, '<br>')}
                        </blockquote>
                        <p>Best regards,<br>
                        <strong>Atharv Chavan</strong><br>
                        Computer Science Engineering Student<br>
                        Rajarambapu Institute of Technology</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                emailSentStatus = "Sent successfully";
            } catch (err) {
                console.error("Nodemailer failed to send email:", err);
                emailSentStatus = `Failed to send email: ${err.message}`;
            }
        } else {
            console.log(`[MOCK EMAIL SENT to ${feedback.email}]`);
            console.log(`Subject: Re: Portfolio Feedback`);
            console.log(`Body:\n${message}`);
        }

        // Add reply to the replies array
        feedback.replies.push({
            message: message,
            sentAt: new Date()
        });

        await feedback.save();

        return res.status(200).json({
            success: true,
            message: `Reply sent successfully. Email status: ${emailSentStatus}`,
            data: feedback
        });
    } catch (error) {
        console.error("Send reply error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass,
    },
  });
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    if (!user || !pass) {
      console.log('Email service (SMTP/EMAIL) not configured. Skipping welcome email.');
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Safe Hands Travels" <${user}>`,
      to: userEmail,
      subject: 'Welcome to Safe Hands Travels! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Safe Hands Travels! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${userName || 'there'},</p>
              <p>Thank you for joining Safe Hands Travels! We're excited to help you create a stunning online presence for your business.</p>
              <p>With Safe Hands Travels, you can:</p>
              <ul>
                <li>Create a professional website in minutes</li>
                <li>Get a custom subdomain instantly</li>
                <li>Showcase your business with photos and videos</li>
                <li>Connect with customers via WhatsApp and phone</li>
              </ul>
              <a href="${process.env.FRONTEND_URL || 'https://safehandstravels.com'}/create-website" class="button">Create Your Website</a>
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>Best regards,<br>The Safe Hands Travels Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw - email failure shouldn't break the flow
  }
};


/**
 * Send trip enquiry email to admin
 */
export const sendTripEnquiryEmail = async (enquiryData) => {
  try {
    // Use EMAIL_USER from env, fallback to SMTP_USER if not set
    const adminEmail = process.env.EMAIL_USER?.trim() || process.env.SMTP_USER?.trim();

    if (!adminEmail) {
      console.error('EMAIL_USER not configured in .env file. Cannot send enquiry email.');
      console.error('Please set EMAIL_USER=your-email@example.com in backend/.env');
      throw new Error('Email configuration missing. Please set EMAIL_USER in .env file.');
    }

    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error('SMTP credentials not configured (tried EMAIL_USER/PASS and SMTP_USER/PASS). Cannot send enquiry email.');
      throw new Error('Email service not configured. Please set EMAIL_USER/PASS or SMTP_USER/PASS in .env file.');
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Safe Hands Travels Enquiries" <${user}>`,
      to: adminEmail,
      subject: `New Trip Enquiry: ${enquiryData.tripTitle || 'Trip Enquiry'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #017233 0%, #01994d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #017233; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #555; }
            .info-value { color: #333; }
            .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Trip Enquiry</h1>
            </div>
            <div class="content">
              <p>You have received a new trip enquiry!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #017233;">Trip Details</h3>
                <div class="info-row">
                  <span class="info-label">Trip:</span>
                  <span class="info-value">${enquiryData.tripTitle || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${enquiryData.tripLocation || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Price:</span>
                  <span class="info-value">${enquiryData.tripPrice || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Selected Month:</span>
                  <span class="info-value">${enquiryData.selectedMonth || 'Not specified'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Number of Travelers:</span>
                  <span class="info-value">${enquiryData.numberOfTravelers || 1}</span>
                </div>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #017233;">Customer Details</h3>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${enquiryData.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value"><a href="mailto:${enquiryData.email}">${enquiryData.email}</a></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${enquiryData.phone || 'Not provided'}</span>
                </div>
              </div>

              ${enquiryData.message ? `
              <div class="message-box">
                <h3 style="margin-top: 0; color: #017233;">Message:</h3>
                <p style="white-space: pre-wrap;">${enquiryData.message}</p>
              </div>
              ` : ''}

              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px;">
                Enquiry received on ${new Date().toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Trip Enquiry

Trip Details:
- Trip: ${enquiryData.tripTitle || 'N/A'}
- Location: ${enquiryData.tripLocation || 'N/A'}
- Price: ${enquiryData.tripPrice || 'N/A'}
- Selected Month: ${enquiryData.selectedMonth || 'Not specified'}
- Number of Travelers: ${enquiryData.numberOfTravelers || 1}

Customer Details:
- Name: ${enquiryData.name}
- Email: ${enquiryData.email}
- Phone: ${enquiryData.phone || 'Not provided'}

${enquiryData.message ? `Message:\n${enquiryData.message}\n` : ''}

Enquiry received on ${new Date().toLocaleString('en-IN')}
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Trip enquiry email sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending trip enquiry email:', error);
    throw error; // Re-throw so we know if email failed
  }
};



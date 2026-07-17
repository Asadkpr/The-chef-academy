import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Support larger payload sizes for base64 uploads (such as video files!)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure public/uploads directory exists on the server disk
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// API endpoint to handle media file uploads
app.post('/api/upload', (req, res) => {
  try {
    const { fileName, fileType, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' });
    }

    // Remove base64 metadata prefix if present (e.g. "data:video/mp4;base64,")
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate safe, unique filename with timestamp
    const ext = path.extname(fileName) || (fileType?.startsWith('image/') ? '.jpg' : '.mp4');
    const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    const uniqueName = `${safeBaseName}-${Date.now()}${ext}`;
    
    const targetPath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    console.log(`[FILE UPLOAD SUCCESS]: ${fileUrl} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
    
    res.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('File upload API failure:', err);
    res.status(500).json({ error: err.message || 'Failed to save uploaded file' });
  }
});

// API endpoint to handle raw binary media uploads (extremely fast, no base64 overhead!)
app.post('/api/upload-raw', express.raw({ type: '*/*', limit: '100mb' }), (req, res) => {
  try {
    const rawFileName = req.headers['x-file-name'] as string;
    const fileType = req.headers['content-type'] as string;
    
    if (!rawFileName) {
      return res.status(400).json({ error: 'Missing x-file-name header' });
    }
    
    const fileName = decodeURIComponent(rawFileName);
    const buffer = req.body;
    
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file buffer received' });
    }

    const ext = path.extname(fileName) || (fileType?.startsWith('image/') ? '.jpg' : '.mp4');
    const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    const uniqueName = `${safeBaseName}-${Date.now()}${ext}`;
    
    const targetPath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    console.log(`[RAW FILE UPLOAD SUCCESS]: ${fileUrl} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
    
    res.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('Raw upload API failure:', err);
    res.status(500).json({ error: err.message || 'Failed to save uploaded file' });
  }
});

// Dynamic HTML Invoice template generator
function generateInvoiceHtml(data: {
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  cnic: string;
  trackingId: string;
  courseTitle: string;
  shift: string;
  regFee: number;
  tuitionFee: number;
  totalFee: number;
  discount?: number;
}) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333333;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
        }
        .header {
          background-color: #0a0f18;
          color: #ffffff;
          padding: 35px;
          text-align: center;
          border-bottom: 3px solid #c19d53;
        }
        .logo-text {
          font-family: 'Georgia', serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: #ffffff;
          margin: 0;
          text-transform: uppercase;
        }
        .logo-sub {
          font-size: 11px;
          letter-spacing: 4px;
          color: #c19d53;
          margin: 5px 0 0 0;
          text-transform: uppercase;
          font-weight: bold;
        }
        .content {
          padding: 35px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          color: #0a0f18;
          margin-top: 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .intro-text {
          font-size: 14px;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 25px;
        }
        .invoice-card {
          background-color: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .grid-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .grid-row:last-child {
          margin-bottom: 0;
        }
        .label {
          color: #64748b;
          font-weight: 500;
        }
        .val {
          color: #0f172a;
          font-weight: 600;
          text-align: right;
        }
        .code-display {
          font-family: monospace;
          background-color: #f1f5f9;
          padding: 3px 6px;
          border-radius: 4px;
          color: #b45309;
        }
        .table-title {
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0a0f18;
          margin-bottom: 12px;
        }
        .fee-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        .fee-table th {
          background-color: #f1f5f9;
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          text-align: left;
          padding: 10px;
          font-weight: bold;
          border-bottom: 1px solid #e2e8f0;
        }
        .fee-table td {
          padding: 12px 10px;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        .fee-table .total-row td {
          font-weight: bold;
          border-top: 2px solid #e2e8f0;
          color: #0a0f18;
          font-size: 14px;
        }
        .bank-details {
          background-color: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .bank-title {
          font-size: 13px;
          font-weight: bold;
          color: #b45309;
          margin-top: 0;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .bank-info {
          font-size: 12px;
          line-height: 1.6;
          color: #78350f;
        }
        .action-button {
          display: block;
          width: max-content;
          margin: 0 auto;
          background-color: #c19d53;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 30px;
          font-size: 13px;
          font-weight: bold;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(193, 157, 83, 0.2);
        }
        .footer {
          background-color: #f1f5f9;
          padding: 20px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          line-height: 1.5;
        }
        .footer a {
          color: #c19d53;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          
          <div class="header">
            <h1 class="logo-text">The Chef's Academy</h1>
            <p class="logo-sub">Lahore & Peshawar Campus</p>
          </div>
          
          <div class="content">
            <h2 class="title">Admission Fee Invoice</h2>
            
            <p class="intro-text">
              Dear <strong>${data.studentName}</strong>,<br><br>
              Alhamdulillah, your admission registration request has been successfully recorded. Your application tracking code is <strong class="code-display">${data.trackingId}</strong>.
              <br><br>
              Please review the registration invoice details below. Kindly pay the outstanding registration fee to secure your batch seat.
            </p>
            
            <div class="invoice-card">
              <div class="grid-row">
                <span class="label">Invoice Date:</span>
                <span class="val">${dateStr}</span>
              </div>
              <div class="grid-row">
                <span class="label">Tracking Code:</span>
                <span class="val" style="color: #c19d53; font-family: monospace;">${data.trackingId}</span>
              </div>
              <div class="grid-row">
                <span class="label">Candidate Name:</span>
                <span class="val">${data.studentName}</span>
              </div>
              <div class="grid-row">
                <span class="label">Father Name:</span>
                <span class="val">${data.fatherName}</span>
              </div>
              <div class="grid-row">
                <span class="label">CNIC/B-Form:</span>
                <span class="val">${data.cnic}</span>
              </div>
              <div class="grid-row">
                <span class="label">Contact Number:</span>
                <span class="val">${data.phone}</span>
              </div>
            </div>
            
            <h3 class="table-title">Program Details & Fees</h3>
            <table class="fee-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${data.courseTitle}</strong><br>
                    <span style="font-size: 11px; color: #64748b;">Shift Selected: ${data.shift}</span>
                  </td>
                  <td style="text-align: right; vertical-align: middle;">PKR ${data.tuitionFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Admission Registration & Enrollment Fee</td>
                  <td style="text-align: right; vertical-align: middle;">PKR ${data.regFee.toLocaleString()}</td>
                </tr>
                ${data.discount && data.discount > 0 ? `
                <tr>
                  <td style="color: #b45309; font-weight: bold;">Special Applied Discount</td>
                  <td style="text-align: right; vertical-align: middle; color: #b45309; font-weight: bold;">- PKR ${data.discount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                  <td>Total Payable Enrollment Fee</td>
                  <td style="text-align: right;">PKR ${data.totalFee.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="bank-details">
              <h3 class="bank-title">Official Payment Instructions</h3>
              <div class="bank-info">
                Please transfer/deposit the registration fee of <strong>PKR ${data.regFee.toLocaleString()}</strong> to the official academy account below to secure your workspace seat:<br><br>
                <strong>Bank Name:</strong> Bank Alfalah Ltd<br>
                <strong>Account Title:</strong> The Chef's Academy Lahore<br>
                <strong>Account Number:</strong> 5502-9018274619<br><br>
                <em>Alternatively, transfer via:</em><br>
                <strong>Easypaisa / JazzCash:</strong> 0333-9123456 (Title: The Chef's Academy)
              </div>
            </div>
            
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/?cms=true" class="action-button">Upload Payment Receipt</a>
            
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 25px; line-height: 1.4;">
              * Note: Once you have transferred the fee, please take a screenshot or photo of your payment receipt/slip, return to our web portal, search your status using your Tracking ID, and upload the receipt to submit it for immediate approval.
            </p>
          </div>
          
          <div class="footer">
            <strong>The Chef's Academy Lahore & Peshawar</strong><br>
            Main GT Road, Near University of Peshawar, Peshawar / Lahore Campus, Pakistan<br>
            Helpline: <a href="https://wa.me/923339123456">0333-9123456</a> | Email: <a href="mailto:info@thechefsacademy.pk">info@thechefsacademy.pk</a>
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;
}

// POST API route to dispatch Email Invoice
app.post('/api/send-invoice', async (req, res) => {
  const {
    studentName,
    fatherName,
    email,
    phone,
    cnic,
    trackingId,
    courseTitle,
    shift,
    regFee,
    tuitionFee,
    totalFee,
    discount
  } = req.body;

  if (!email || !studentName || !trackingId) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  const htmlContent = generateInvoiceHtml({
    studentName,
    fatherName,
    email,
    phone,
    cnic,
    trackingId,
    courseTitle,
    shift,
    regFee,
    tuitionFee,
    totalFee,
    discount: discount ? Number(discount) : 0
  });

  const isSmtpConfigured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

  console.log(`\n=================== [INVOICE DISPATCH] ===================`);
  console.log(`Tracking ID: ${trackingId}`);
  console.log(`Student Name: ${studentName}`);
  console.log(`Email Sent To: ${email}`);
  console.log(`Course Program: ${courseTitle}`);
  console.log(`Reg Fee: PKR ${regFee} | Total Fee: PKR ${totalFee}`);
  console.log(`SMTP Configured: ${isSmtpConfigured ? 'YES' : 'NO'}`);
  console.log(`==========================================================\n`);

  if (isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || `"The Chef's Academy" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Admission Invoice & Tracking Code: ${trackingId} — The Chef's Academy`,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully via SMTP to ${email}`);

      return res.json({
        success: true,
        method: 'SMTP',
        message: 'Invoice email has been sent successfully to your registered email address!',
        invoiceHtml: htmlContent
      });
    } catch (err: any) {
      console.error('SMTP Email dispatch failed:', err.message);
      // Fallback with response stating email failed but invoice is generated
      return res.json({
        success: true,
        method: 'FALLBACK_PREVIEW',
        error: `Could not send email directly: ${err.message}`,
        message: 'Your registration is successful! (Email failed, displaying invoice below).',
        invoiceHtml: htmlContent
      });
    }
  } else {
    // Return the invoice HTML directly so the client can display/render it beautifully in the UI as a downloadable card
    return res.json({
      success: true,
      method: 'SIMULATED',
      message: 'Invoice simulated and sent successfully! (SMTP parameters not configured in .env, showing local invoice preview).',
      invoiceHtml: htmlContent
    });
  }
});

// Start dev server with Vite in dev, serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

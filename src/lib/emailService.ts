export interface InvoicePayload {
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
  paymentSettings?: any;
}

export interface SubmissionPayload {
  studentName: string;
  email: string;
  trackingId: string;
  courseTitle: string;
  shift: string;
}

export function generateSubmissionConfirmationHtml(data: SubmissionPayload): string {
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
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f8fafc; padding: 30px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background-color: #0a0f18; color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #c19d53; }
        .logo-text { font-family: 'Georgia', serif; font-size: 22px; letter-spacing: 2px; color: #ffffff; margin: 0; text-transform: uppercase; }
        .logo-sub { font-size: 11px; letter-spacing: 3px; color: #c19d53; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; }
        .content { padding: 30px; }
        .title { font-size: 18px; font-weight: bold; color: #0a0f18; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .intro-text { font-size: 14px; line-height: 1.7; color: #4a5568; margin-bottom: 25px; }
        .tracking-box { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center; }
        .tracking-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #92400e; font-weight: bold; margin-bottom: 8px; }
        .tracking-code { font-family: monospace; font-size: 22px; font-weight: bold; color: #b45309; }
        .details-card { background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .grid-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .label { color: #64748b; font-weight: 500; }
        .val { color: #0f172a; font-weight: 600; text-align: right; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
        .note-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; font-size: 13px; color: #166534; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo-text"><strong>THE CHEF'S ACADEMY</strong></h1>
            <p class="logo-sub"><strong>79-B3 Gulberg III, Lahore, Pakistan</strong></p>
          </div>
          <div class="content">
            <h2 class="title">Application Submitted Successfully ✓</h2>
            <p class="intro-text">
              Dear <strong>${data.studentName}</strong>,<br><br>
              Thank you for applying to <strong>The Chef's Academy</strong>. We have successfully received your admission application dated <strong>${dateStr}</strong>.<br><br>
              Our admissions team will review your application and contact you shortly with further instructions.
            </p>
            <div class="tracking-box">
              <div class="tracking-label">Your Application Tracking Code</div>
              <div class="tracking-code">${data.trackingId}</div>
              <p style="font-size: 11px; color: #92400e; margin-top: 8px; margin-bottom: 0;">Keep this code safe to track your application status.</p>
            </div>
            <div class="details-card">
              <div class="grid-row"><span class="label">Candidate Name:</span><span class="val">${data.studentName}</span></div>
              <div class="grid-row"><span class="label">Program Selected:</span><span class="val">${data.courseTitle}</span></div>
              <div class="grid-row"><span class="label">Shift:</span><span class="val">${data.shift}</span></div>
              <div class="grid-row"><span class="label">Application Date:</span><span class="val">${dateStr}</span></div>
            </div>
            <div class="note-box">
              <strong>What happens next?</strong><br>
              Our admissions team will reach out to you via phone or WhatsApp. You may also visit our campus at <strong>79-B3 Gulberg III, Lahore</strong> or call us at <strong>0333-9123456</strong> for any queries.
            </div>
          </div>
          <div class="footer">
            <strong>The Chef's Academy — Lahore</strong><br>
            79-B3 Gulberg III, Lahore | Helpline: 0333-9123456 | Email: info@thechefsacademy.pk
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendSubmissionConfirmationEmail(payload: SubmissionPayload): Promise<{ success: boolean; method: string; message: string }> {
  // Primary Attempt: Server API (/api/send-invoice)
  try {
    const res = await window.fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: payload.studentName,
        email: payload.email,
        trackingId: payload.trackingId,
        courseTitle: payload.courseTitle,
        shift: payload.shift,
        isSubmissionOnly: true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return { success: true, method: data.method || 'SMTP', message: `Confirmation email sent to ${payload.email}` };
      }
    }
  } catch (e) {
    console.warn('[EMAIL SERVICE]: Submission confirmation — Node API unavailable. Switching to live host dispatch...');
  }

  // Live Hosting Fallback (FormSubmit autoresponder)
  try {
    const confirmHtml = generateSubmissionConfirmationHtml(payload);
    const fsRes = await window.fetch(`https://formsubmit.co/ajax/${encodeURIComponent(payload.email)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Application Received — Tracking Code: ${payload.trackingId} | The Chef's Academy`,
        _autoresponse: confirmHtml,
        _captcha: 'false',
        "Sender Name": "The Chef's Academy Lahore",
        "Student Name": payload.studentName,
        "Tracking Code": payload.trackingId,
        "Course Selected": payload.courseTitle,
        "Shift": payload.shift,
        "Message": "Your admission application has been received. Our team will contact you shortly.",
      }),
    });

    if (fsRes.ok) {
      return { success: true, method: 'LIVE_HOST_DISPATCH', message: `Confirmation email sent to ${payload.email}` };
    }
  } catch (err) {
    console.warn('[EMAIL SERVICE]: Live host submission email dispatch error:', err);
  }

  return { success: true, method: 'RECORDED', message: `Application recorded for ${payload.studentName}.` };
}

export function generateInvoiceHtml(data: InvoicePayload): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const p = data.paymentSettings || {};
  const bankName = p.bankName || 'Bank Alfalah Ltd';
  const accountTitle = p.accountTitle || "The Chef's Academy Lahore";
  const accountNumber = p.accountNumber || '5502-9018274619';
  const iban = p.iban || '';
  const mobileName = p.mobileName || 'Easypaisa / JazzCash';
  const mobileNumber = p.mobileNumber || '0333-9123456';
  const mobileTitle = p.mobileTitle || "The Chef's Academy";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f8fafc; padding: 30px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background-color: #0a0f18; color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #c19d53; }
        .logo-text { font-family: 'Georgia', serif; font-size: 22px; letter-spacing: 2px; color: #ffffff; margin: 0; text-transform: uppercase; }
        .logo-sub { font-size: 11px; letter-spacing: 3px; color: #c19d53; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; }
        .content { padding: 30px; }
        .title { font-size: 18px; font-weight: bold; color: #0a0f18; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .intro-text { font-size: 14px; line-height: 1.6; color: #4a5568; margin-bottom: 25px; }
        .invoice-card { background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .grid-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .label { color: #64748b; font-weight: 500; }
        .val { color: #0f172a; font-weight: 600; text-align: right; }
        .code-display { font-family: monospace; background-color: #f1f5f9; padding: 3px 6px; border-radius: 4px; color: #b45309; font-weight: bold; }
        .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .fee-table th { background-color: #f1f5f9; font-size: 11px; text-transform: uppercase; color: #64748b; text-align: left; padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0; }
        .fee-table td { padding: 12px 10px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .fee-table .total-row td { font-weight: bold; border-top: 2px solid #e2e8f0; color: #0a0f18; font-size: 14px; }
        .bank-details { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .bank-title { font-size: 13px; font-weight: bold; color: #b45309; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; }
        .bank-info { font-size: 12px; line-height: 1.6; color: #78350f; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo-text" style="font-weight: bold;"><strong>THE CHEF'S ACADEMY</strong></h1>
            <p class="logo-sub" style="font-weight: bold; color: #c19d53;"><strong>79-B3 Gulberg III, Lahore, Pakistan</strong></p>
          </div>
          <div class="content">
            <h2 class="title">Admission Fee Invoice</h2>
            <p class="intro-text">
              Dear <strong>${data.studentName}</strong>,<br><br>
              Your admission registration request has been successfully recorded. Your application tracking code is <strong class="code-display">${data.trackingId}</strong>.<br><br>
              Please review the registration invoice details below. Kindly pay the outstanding registration fee to secure your batch seat.
            </p>
            <div class="invoice-card">
              <div class="grid-row"><span class="label">Date:</span><span class="val">${dateStr}</span></div>
              <div class="grid-row"><span class="label">Tracking Code:</span><span class="val" style="color: #c19d53; font-family: monospace;">${data.trackingId}</span></div>
              <div class="grid-row"><span class="label">Candidate Name:</span><span class="val">${data.studentName}</span></div>
              <div class="grid-row"><span class="label">Father Name:</span><span class="val">${data.fatherName}</span></div>
              <div class="grid-row"><span class="label">CNIC/B-Form:</span><span class="val">${data.cnic}</span></div>
              <div class="grid-row"><span class="label">Phone:</span><span class="val">${data.phone}</span></div>
            </div>
            <table class="fee-table">
              <thead>
                <tr><th>Description</th><th style="text-align: right;">Amount (PKR)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${data.courseTitle}</strong><br><span style="font-size: 11px; color: #64748b;">Shift: ${data.shift}</span></td>
                  <td style="text-align: right;">PKR ${data.tuitionFee.toLocaleString()}</td>
                </tr>
                <tr><td>Registration Fee</td><td style="text-align: right;">PKR ${data.regFee.toLocaleString()}</td></tr>
                ${data.discount && data.discount > 0 ? `
                <tr><td style="color: #b45309; font-weight: bold;">Applied Discount</td><td style="text-align: right; color: #b45309; font-weight: bold;">- PKR ${data.discount.toLocaleString()}</td></tr>
                ` : ''}
                <tr class="total-row"><td>Total Payable Fee</td><td style="text-align: right;">PKR ${data.totalFee.toLocaleString()}</td></tr>
              </tbody>
            </table>
            <div class="bank-details">
              <h3 class="bank-title">Official Bank / Wallet Details</h3>
              <div class="bank-info">
                <strong>Bank Name:</strong> ${bankName}<br>
                <strong>Account Title:</strong> ${accountTitle}<br>
                ${iban ? `<strong>IBAN Number:</strong> <strong>${iban}</strong><br>` : ''}<br>
                <strong>${mobileName}:</strong> ${mobileNumber} (Title: ${mobileTitle})
              </div>
            </div>
          </div>
          <div class="footer">
            <strong>The Chef's Academy — Lahore</strong><br>
            79-B3 Gulberg III, Lahore | Helpline: 0333-9123456 | Email: info@thechefsacademy.pk
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendInvoiceEmail(payload: InvoicePayload): Promise<{ success: boolean; method: string; message: string; invoiceHtml: string; error?: string }> {
  const localInvoiceHtml = generateInvoiceHtml(payload);

  // Primary Attempt: Server API (/api/send-invoice)
  try {
    const res = await window.fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          method: data.method || 'SMTP',
          message: data.message || `Invoice sent successfully to ${payload.email}`,
          invoiceHtml: data.invoiceHtml || localInvoiceHtml,
        };
      }
    }
  } catch (e) {
    console.warn('[EMAIL SERVICE]: /api/send-invoice unavailable. Switching to live host dispatch...');
  }

  // Live Hosting Fallback (FormSubmit autoresponder)
  try {
    const fsRes = await window.fetch(`https://formsubmit.co/ajax/${encodeURIComponent(payload.email)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Admission Invoice & Tracking Code: ${payload.trackingId} — The Chef's Academy`,
        _autoresponse: localInvoiceHtml,
        _captcha: 'false',
        "Sender Name": "The Chef's Academy Lahore",
        "Student Name": payload.studentName,
        "Father Name": payload.fatherName,
        "Tracking Code": payload.trackingId,
        "Course Selected": payload.courseTitle,
        "Shift": payload.shift,
        "Registration Fee": `PKR ${payload.regFee.toLocaleString()}`,
        "Tuition Fee": `PKR ${payload.tuitionFee.toLocaleString()}`,
        "Total Payable Fee": `PKR ${payload.totalFee.toLocaleString()}`,
      }),
    });

    if (fsRes.ok) {
      return {
        success: true,
        method: 'LIVE_HOST_DISPATCH',
        message: `Invoice email dispatched successfully to ${payload.email}!`,
        invoiceHtml: localInvoiceHtml,
      };
    }
  } catch (err: any) {
    console.warn('[EMAIL SERVICE]: Live host invoice email dispatch error:', err);
  }

  return {
    success: true,
    method: 'CLIENT_INVOICE_GENERATED',
    message: `Invoice generated successfully for ${payload.studentName} (Tracking Code: ${payload.trackingId}).`,
    invoiceHtml: localInvoiceHtml,
  };
}

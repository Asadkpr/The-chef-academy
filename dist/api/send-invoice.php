<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || empty($data['email']) || empty($data['studentName'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    exit();
}

$studentName = htmlspecialchars($data['studentName']);
$fatherName = htmlspecialchars($data['fatherName'] ?? '');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone'] ?? '');
$cnic = htmlspecialchars($data['cnic'] ?? '');
$trackingId = htmlspecialchars($data['trackingId'] ?? '');
$courseTitle = htmlspecialchars($data['courseTitle'] ?? '');
$shift = htmlspecialchars($data['shift'] ?? '');
$regFee = isset($data['regFee']) ? number_format($data['regFee']) : '0';
$tuitionFee = isset($data['tuitionFee']) ? number_format($data['tuitionFee']) : '0';
$totalFee = isset($data['totalFee']) ? number_format($data['totalFee']) : '0';
$discount = isset($data['discount']) ? number_format($data['discount']) : '0';

$p = $data['paymentSettings'] ?? [];
$bankName = htmlspecialchars($p['bankName'] ?? 'Bank Alfalah Ltd');
$accountTitle = htmlspecialchars($p['accountTitle'] ?? "The Chef's Academy Lahore");
$accountNumber = htmlspecialchars($p['accountNumber'] ?? '5502-9018274619');
$iban = htmlspecialchars($p['iban'] ?? '');
$mobileName = htmlspecialchars($p['mobileName'] ?? 'Easypaisa / JazzCash');
$mobileNumber = htmlspecialchars($p['mobileNumber'] ?? '0333-9123456');
$mobileTitle = htmlspecialchars($p['mobileTitle'] ?? "The Chef's Academy");

$dateStr = date('F j, Y');
$subject = "Admission Invoice & Tracking Code: {$trackingId} — The Chef's Academy";

$htmlContent = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
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
  <div class='wrapper'>
    <div class='container'>
      <div class='header'>
        <h1 class='logo-text' style='font-weight: bold;'><strong>THE CHEF'S ACADEMY</strong></h1>
        <p class='logo-sub' style='font-weight: bold; color: #c19d53;'><strong>79-B3 Gulberg III, Lahore, Pakistan</strong></p>
      </div>
      <div class='content'>
        <h2 class='title'>Admission Fee Invoice</h2>
        <p class='intro-text'>
          Dear <strong>{$studentName}</strong>,<br><br>
          Your admission registration request has been successfully recorded. Your application tracking code is <strong class='code-display'>{$trackingId}</strong>.<br><br>
          Please review the registration invoice details below. Kindly pay the outstanding registration fee to secure your batch seat.
        </p>
        <div class='invoice-card'>
          <div class='grid-row'><span class='label'>Date:</span><span class='val'>{$dateStr}</span></div>
          <div class='grid-row'><span class='label'>Tracking Code:</span><span class='val' style='color: #c19d53; font-family: monospace;'>{$trackingId}</span></div>
          <div class='grid-row'><span class='label'>Candidate Name:</span><span class='val'>{$studentName}</span></div>
          <div class='grid-row'><span class='label'>Father Name:</span><span class='val'>{$fatherName}</span></div>
          <div class='grid-row'><span class='label'>CNIC/B-Form:</span><span class='val'>{$cnic}</span></div>
          <div class='grid-row'><span class='label'>Phone:</span><span class='val'>{$phone}</span></div>
        </div>
        <table class='fee-table'>
          <thead>
            <tr><th>Description</th><th style='text-align: right;'>Amount (PKR)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{$courseTitle}</strong><br><span style='font-size: 11px; color: #64748b;'>Shift: {$shift}</span></td>
              <td style='text-align: right;'>PKR {$tuitionFee}</td>
            </tr>
            <tr><td>Registration Fee</td><td style='text-align: right;'>PKR {$regFee}</td></tr>
            <tr class='total-row'><td>Total Payable Fee</td><td style='text-align: right;'>PKR {$totalFee}</td></tr>
          </tbody>
        </table>
        <div class='bank-details'>
          <h3 class='bank-title'>Official Bank / Wallet Details</h3>
          <div class='bank-info'>
            <strong>Bank Name:</strong> {$bankName}<br>
            <strong>Account Title:</strong> {$accountTitle}<br>
            <strong>Account Number:</strong> {$accountNumber}<br>
            " . ($iban ? "<strong>IBAN:</strong> {$iban}<br>" : "") . "<br>
            <strong>{$mobileName}:</strong> {$mobileNumber} (Title: {$mobileTitle})
          </div>
        </div>
      </div>
      <div class='footer'>
        <strong>The Chef's Academy — Lahore</strong><br>
        79-B3 Gulberg III, Lahore | Helpline: 0333-9123456 | Email: tca9881@gmail.com
      </div>
    </div>
  </div>
</body>
</html>
";

function sendGmailSmtpSocket($toEmail, $subject, $body, $fromEmail = 'tca9881@gmail.com', $fromName = "The Chef's Academy Lahore", $pass = 'cclhmjnjofmltnbr') {
    $host = 'smtp.gmail.com';
    $port = 587;
    $timeout = 15;

    $socket = @fsockopen($host, $port, $errno, $errstr, $timeout);
    if (!$socket) {
        throw new Exception("Socket connection to {$host}:{$port} failed: {$errstr} ({$errno})");
    }

    $read = function() use ($socket) {
        $res = '';
        while ($str = fgets($socket, 512)) {
            $res .= $str;
            if (substr($str, 3, 1) == ' ') break;
        }
        return $res;
    };

    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    $read();
    $send("EHLO " . gethostname());
    $send("STARTTLS");

    $crypto = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT);
    if (!$crypto) {
        fclose($socket);
        throw new Exception("TLS negotiation failed");
    }

    $send("EHLO " . gethostname());
    $send("AUTH LOGIN");
    $send(base64_encode($fromEmail));
    $resp = $send(base64_encode($pass));

    if (strpos($resp, '235') === false) {
        fclose($socket);
        throw new Exception("SMTP Authentication failed: " . trim($resp));
    }

    $send("MAIL FROM: <{$fromEmail}>");
    $send("RCPT TO: <{$toEmail}>");
    $send("DATA");

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n";
    $headers .= "To: <{$toEmail}>\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";

    $send($headers . "\r\n" . $body . "\r\n.");
    $send("QUIT");
    fclose($socket);
    return true;
}

try {
    sendGmailSmtpSocket($email, $subject, $htmlContent);
    echo json_encode([
        'success' => true,
        'method' => 'PHP_GMAIL_SMTP',
        'message' => "Invoice email sent successfully to {$email} via tca9881@gmail.com",
        'invoiceHtml' => $htmlContent
    ]);
} catch (Exception $e) {
    // Backup: Try standard PHP mail() on server
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: The Chef's Academy Lahore <tca9881@gmail.com>\r\n";

    if (@mail($email, $subject, $htmlContent, $headers)) {
        echo json_encode([
            'success' => true,
            'method' => 'PHP_MAIL_FALLBACK',
            'message' => "Invoice email sent to {$email}",
            'invoiceHtml' => $htmlContent
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => "SMTP Error: " . $e->getMessage()
        ]);
    }
}

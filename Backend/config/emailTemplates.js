export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Welcome to MedGenix</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button-container {
      text-align: center;
      padding: 16px 0;
    }

    .button {
      display: inline-block;
      background: #008080;
      text-decoration: none;
      padding: 12px 20px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      border-radius: 7px;
    }

    .header {
      background: #008080;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }

      .button {
        width: 60% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="500" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="header">
                  <h1>Welcome to MedGenix</h1>
                </td>
              </tr>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Welcome {{name}}!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          Thank you for joining MedGenix - your trusted platform for OCR scanning and generic medicine recommendations.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          To get started, please verify your email address and mobile number.
                        </td>
                      </tr>
                      <tr>
                        <td class="button-container">
                          <a href="{{welcome_link}}" class="button">Verify Your Account</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 10px; font-size: 14px; line-height: 150%;">
                          <strong>Your login credentials are:</strong><br>
                          📧 Email: {{email}}<br>
                          🔑 Password: {{password}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 10px; font-size: 14px; line-height: 150%;">
                          If you have any questions, feel free to reach out to our support team.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;


export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Verify Your MedGenix Account</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .header {
      background: #008080;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .otp-box {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #008080;
      border-radius: 7px;
      margin: 20px 0;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="500" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="header">
                  <h1>Verify Your Account</h1>
                </td>
              </tr>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Hello!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          Thank you for registering with MedGenix. To complete your registration, please verify your email address: <span style="color: #008080;">{{email}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the verification code below to verify your account:
                        </td>
                      </tr>
                      <tr>
                        <td class="otp-box">
                          {{otp}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This code will expire in 24 hours.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 10px; font-size: 14px; line-height: 150%;">
                          If you didn't request this verification, please ignore this email.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Reset Your MedGenix Password</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .header {
      background: #008080;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .otp-box {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #008080;
      border-radius: 7px;
      margin: 20px 0;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="500" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="header">
                  <h1>Reset Your Password</h1>
                </td>
              </tr>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Hello!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your MedGenix account: <span style="color: #008080;">{{email}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the verification code below to reset your password:
                        </td>
                      </tr>
                      <tr>
                        <td class="otp-box">
                          {{otp}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This code will expire in 15 minutes.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 10px; font-size: 14px; line-height: 150%;">
                          If you didn't request this password reset, please ignore this email.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const EMAIL_OTP_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Login Verification - MedGenix</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .header {
      background: #008080;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .otp-box {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #008080;
      border-radius: 7px;
      margin: 20px 0;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="500" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="header">
                  <h1>Login Verification</h1>
                </td>
              </tr>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Hello!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a login request for your MedGenix account: <span style="color: #008080;">{{email}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the verification code below to login to your account:
                        </td>
                      </tr>
                      <tr>
                        <td class="otp-box">
                          {{otp}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This code will expire in 5 minutes.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 10px; font-size: 14px; line-height: 150%;">
                          If you didn't request this login, please ignore this email and secure your account.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;


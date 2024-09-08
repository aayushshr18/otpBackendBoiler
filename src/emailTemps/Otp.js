const otpTemplate = (otp) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eeeeee;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp {
            font-size: 36px;
            font-weight: bold;
            color: #4CAF50;
          }
          .footer {
            padding: 10px 0;
            text-align: center;
            font-size: 12px;
            color: #aaaaaa;
            border-top: 1px solid #eeeeee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP Code</h1>
          </div>
          <div class="content">
            <p>Your OTP for authentication of your Collings Denture account is:
  </p>
            <p class="otp">${otp}</p>
            <p>It expires in 3 minutes. Please use this OTP to securely log in.</p>
          </div>
          <div class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
   `;
  };
  
  module.exports = otpTemplate;
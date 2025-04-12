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
          width: 600px;
          margin: 0 auto;
          background-color: #ffffff !important;
          padding: 20px;
          border:2px solid black;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius:20px;
        }
        .header {
          display: flex;
          align-items: center;
          
          width: 100%;
          padding: 10px 0;
        }

        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .header img {
height: 80px;
width: 200px;
object-fit: contain;
margin-left: auto; 
}

        .content {
          padding: 20px;
          text-align: start;
        }
        .content p{
          color: #05013880;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          background-color: #F3F4F8;
          text-align: center;
          color: #000000;
          padding: 20px 0;
          border-radius: 8px;
          word-wrap: break-word;
        }
        .verify-button {
          display: inline-block;
          padding: 12px 24px;
          color: #ffffff !important;
          background-color: #000000;
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
          border-radius: 5px;
          transition: background-color 0.3s;
          text-align: center;
          width: 100%;
          max-width: 300px;
        }
        .verify-button:hover {
          background-color: #232D3F;
        }
        .footer {
          padding: 10px 0;
          text-align: center;
          font-size: 12px;
          color: #aaaaaa;
          border-top: 1px solid #eeeeee;
        }
        .return-button {
          border: 1px solid black;
          color: black !important;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
        }
        @media (max-width: 480px) {
          .container {
            width:300px;
            padding: 15px;
          }
          .header h1 {
            font-size: 20px;
          }
          .otp {
            font-size: 28px;
            padding: 15px 0;
          }
          .verify-button {
            padding: 10px;
            font-size: 14px;
          }
          .return-button {
            font-size: 12px;
            padding: 6px 12px;
          }
        }

      </style>
    </head>
    <body>
      <div class="container">
        <div  class="header">
          <h1>${process.env.COMPANY_NAME}</h1>
          <img src=${process.env.COMPANY_LOGO} alt="logo" /> 
        </div>
        <div class="content">
          <h1>Login Now</h1>
          <p>Please enter this confirmation code in the window where you started logging in your account</p>
          <h1 class="otp">${otp}</h1>
          <p>From your mobile device use the code to confirm email.</p>
          <h3>If you did’t create an account in ${process.env.COMPANY_NAME}, please ignore this message</h3>
        </div>
      </div>
      <div class="footer">
        <p>You have received this notification because you have signed up for <br /> ${process.env.COMPANY_NAME}</p>
      </div>
    </body>
    </html>
 `;
};

module.exports = otpTemplate;

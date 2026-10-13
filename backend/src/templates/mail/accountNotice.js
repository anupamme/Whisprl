export default ({ name, heading, body, reason }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${heading}</title>
      <style type="text/css">
        :root {
          color-scheme: light only;
        }

        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 50px auto;
          padding: 32px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          color: #333;
        }

        .logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo img {
          max-width: 80px;
        }

        h1 {
          font-size: 22px;
          margin: 0 0 16px;
        }

        p {
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 12px;
        }

        .reason {
          margin: 20px 0;
          padding: 12px 16px;
          border-left: 3px solid #212b36;
          background-color: #f6f7f8;
        }

        .reason-label {
          font-size: 13px;
          font-weight: bold;
          color: #555;
          margin-bottom: 4px;
        }

        .footer {
          text-align: center;
          font-size: 13px;
          color: #777;
          margin-top: 24px;
        }

        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <a href="https://whisprl.netlify.app/">
            <img src="https://i.imgur.com/KZkoFRO.png" alt="Whisprl Logo" />
          </a>
        </div>
        <h1>${heading}</h1>
        <p>Hey ${name},</p>
        <p>${body}</p>
        <div class="reason">
          <div class="reason-label">Why</div>
          <div>${reason}</div>
        </div>
        <p>If you think this is a mistake, reply to this email and tell us why.</p>
      </div>
      <div class="footer">
        <p>
          For any assistance, please contact
          <a href="mailto:whisprl@gmail.com">whisprl@gmail.com</a>.
        </p>
      </div>
    </body>
  </html>
`;

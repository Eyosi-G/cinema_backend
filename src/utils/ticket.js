const qrCode = require("qrcode");

const generateContent = async (
  data = { title, screen, schedule, seats, cinema, total, code }
) => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Ticket</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
      />
  
      <!-- Compiled and minified JavaScript -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
      <style>
        .body {
          padding: 20px;
          background-color: rgb(250, 250, 250);
          font-family: "IBM Plex Sans Arabic", sans-serif;
        }
        .card {
          background-color: white;
          padding: 10px;
          border: 1px dashed;
          box-shadow: none;
        }
        .title {
          font-weight: 500;
        }
      </style>
    </head>
    <body class="body">
      <div class="card darken-1">
        <table>
          <thead>
            <tr style="border: 0px">
              <th>${data.title}&nbsp;|&nbsp;${data.screen}</th>
            </tr>
          </thead>
  
          <tbody>
            <tr style="border: 0px">
              <td class="title">Schedule</td>
              <td>${data.schedule}</td>
            </tr>
            <tr style="border: 0px">
              <td class="title">Seats</td>
              <td>${data.seats}</td>
            </tr>
            <tr style="border: 0px">
              <td class="title">Cinema Hall</td>
              <td>${data.cinema}</td>
            </tr>
            <tr style="border: 0px">
              <td class="title">Total</td>
              <td>${data.total}</td>
            </tr>
            <tr style="border: 0px">
              <td class="title">Code</td>
              <td>${data.code}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>
  
  `;
  const image = await qrCode.toBuffer(data.code);

  return { template, image };
};

module.exports = generateContent;

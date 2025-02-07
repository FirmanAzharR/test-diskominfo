const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");
const Postgres = require("../libraries")("Postgres");
const postgres = Postgres.getInstance().conn;
require("dotenv").config();

const send = async (from, to, subject, text, html, attachments = []) => {
  let pool = true;
  let host = process.env.MAIL_HOST;
  let port = process.env.MAIL_PORT;
  let secure = false;
  let user = process.env.MAIL_USER;
  let pass = process.env.MAIL_PASSWORD;

  let transporter = nodemailer.createTransport({
    pool: pool,
    host: host,
    port: port,
    secure: secure,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: user,
      pass: pass,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments,
  });
};

const sendMailRegister = async (to, data) => {
  let from = '"Nama Aplikasi" <no-reply@taas.id>';
  let subject = "Nama Subject";
  let text = "";

  let html = templateEmailRegister(data);

  send(from, to, subject, text, html);
};

const sendMailOTP = async (to, data) => {
  let from = '"LRT MAKASSAR" <no-reply@lrt-makassar.id>';
  let subject = "Request OTP - LRT MAKASSAR";
  let text = "";

  let html = templateEmailOTP(data);

  send(from, to, subject, text, html);
};

const sendMailForgotPassword = async (to, memberName, resetCode) => {
  //   let url =
  //     (await cache.getCustomParam("URL_API")) +
  //     "/member/resetPasswordPage?reset_code=" +
  resetCode;
  let from = '"TaaS Transportation Digital" <no-reply@taas.id>';
  let subject = "Reset Password TaaS Transportation Digital";
  let text = "";
  let html = templateEmailForgotPassword(url, memberName);

  send(from, to, subject, text, html);
};

const templateEmailRegister = (data) => {
  let content = `
        <!doctype html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Cloud Ticketing System</title>
            <style>
            /* -------------------------------------
                GLOBAL RESETS
            ------------------------------------- */
            img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%; }
        
            body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%; }
        
            table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%; }
                table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top; }
        
            /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */
        
            .body {
                background-color: #f6f6f6;
                width: 100%; }
        
            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
                display: block;
                Margin: 0 auto !important;
                /* makes it centered */
                max-width: 680px;
                padding: 10px;
                width: 680px; }
        
            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
                box-sizing: border-box;
                display: block;
                Margin: 0 auto;
                max-width: 680px;
                padding: 10px; }
        
            /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%; }
        
            .wrapper {
                box-sizing: border-box;
                padding: 20px; }
        
            .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
            }
        
            .footer {
                clear: both;
                Margin-top: 10px;
                text-align: center;
                width: 100%; }
                .footer td,
                .footer p,
                .footer span,
                .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center; }
        
            /* -------------------------------------
                TYPOGRAPHY
            ------------------------------------- */
            h1,
            h2,
            h3,
            h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                Margin-bottom: 30px; }
        
            h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize; }
        
            p,
            ul,
            ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                Margin-bottom: 15px; }
                p li,
                ul li,
                ol li {
                list-style-position: inside;
                margin-left: 5px; }
        
            a {
                color: #3498postgres;
                text-decoration: underline; }
        
            /* -------------------------------------
                BUTTONS
            ------------------------------------- */
            .btn {
                box-sizing: border-box;
                width: 100%; }
                .btn > tbody > tr > td {
                padding-bottom: 15px; }
                .btn table {
                width: auto; }
                .btn table td {
                background-color: #3e8dc6;
                border-radius: 5px;
                text-align: center; }
                .btn a {
                background-color: #3e8dc6;
                border: solid 1px #3e8dc6;
                border-radius: 5px;
                box-sizing: border-box;
                color: #e3d76e;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize; }
        
            .btn-primary table td {
                background-color: #3e8dc6; }
        
            .btn-primary a {
                background-color: #3e8dc6;
                border-color: #3e8dc6;
                color: #e3d76e; }
        
            /* -------------------------------------
                OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
                margin-bottom: 0; }
        
            .first {
                margin-top: 0; }
        
            .align-center {
                text-align: center; }
        
            .align-right {
                text-align: right; }
        
            .align-left {
                text-align: left; }
        
            .clear {
                clear: both; }
        
            .mt0 {
                margin-top: 0; }
        
            .mb0 {
                margin-bottom: 0; }
        
            .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0; }
        
            .powered-by a {
                text-decoration: none; }
        
            hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                Margin: 20px 0; }
        
            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important; }
                table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
                font-size: 16px !important; }
                table[class=body] .wrapper,
                table[class=body] .article {
                padding: 10px !important; }
                table[class=body] .content {
                padding: 0 !important; }
                table[class=body] .container {
                padding: 0 !important;
                width: 100% !important; }
                table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important; }
                table[class=body] .btn table {
                width: 100% !important; }
                table[class=body] .btn a {
                width: 100% !important; }
                table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important; }}
        
            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
                .ExternalClass {
                width: 100%; }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                line-height: 100%; }
                .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important; }
                .btn-primary table td:hover {
                background-color: #34495e !important; }
                .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important; } }
            
            .btn {
                -webkit-border-radius: 5;
                -moz-border-radius: 5;
                border-radius: 5px;
                font-family: Arial;
                color: #e3d76e;
                font-size: 16px;
                font-weight: 'bold' !important;
                background: #3e8dc6;
                padding: 13px 50px 13px 50px;
                text-decoration: none;
            }
        
            .btn:hover {
                background: #29618a;
                color: #f9f1a8;
                text-decoration: none;
            }
            </style>
        </head>
        <body class="">
            <table border="0" cellpadding="0" cellspacing="0" class="body">
            <tr>
                <td>&nbsp;</td>
                <td class="container">
                <div class="content">
        
                    <table class="main">
        
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                            <td>
                                <p>Dear<strong> ${data.member_name} </strong>,</p>
                                <p>Terima kasih telah melakukan registrasi. Berikut kode OTP untuk proses aktivasi member</p>
                                <br>
                                <p><b><h1>${data.otp_code}</h1></b></p>
                                <br>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
        
                    <!-- END MAIN CONTENT AREA -->
                    </table>
        
                <!-- END CENTERED WHITE CONTAINER -->
                </div>
                </td>
                <td>&nbsp;</td>
            </tr>
            </table>
        </body>
        </html>
    `;
  return content;
};

const templateEmailOTP = (data) => {
    // console.log(data)
  let content = `
        <!doctype html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Cloud Ticketing System</title>
            <style>
            /* -------------------------------------
                GLOBAL RESETS
            ------------------------------------- */
            img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%; }
        
            body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%; }
        
            table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%; }
                table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top; }
        
            /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */
        
            .body {
                background-color: #f6f6f6;
                width: 100%; }
        
            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
                display: block;
                Margin: 0 auto !important;
                /* makes it centered */
                max-width: 680px;
                padding: 10px;
                width: 680px; }
        
            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
                box-sizing: border-box;
                display: block;
                Margin: 0 auto;
                max-width: 680px;
                padding: 10px; }
        
            /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%; }
        
            .wrapper {
                box-sizing: border-box;
                padding: 20px; }
        
            .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
            }
        
            .footer {
                clear: both;
                Margin-top: 10px;
                text-align: center;
                width: 100%; }
                .footer td,
                .footer p,
                .footer span,
                .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center; }
        
            /* -------------------------------------
                TYPOGRAPHY
            ------------------------------------- */
            h1,
            h2,
            h3,
            h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                Margin-bottom: 30px; }
        
            h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize; }
        
            p,
            ul,
            ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                Margin-bottom: 15px; }
                p li,
                ul li,
                ol li {
                list-style-position: inside;
                margin-left: 5px; }
        
            a {
                color: #3498postgres;
                text-decoration: underline; }
        
            /* -------------------------------------
                BUTTONS
            ------------------------------------- */
            .btn {
                box-sizing: border-box;
                width: 100%; }
                .btn > tbody > tr > td {
                padding-bottom: 15px; }
                .btn table {
                width: auto; }
                .btn table td {
                background-color: #3e8dc6;
                border-radius: 5px;
                text-align: center; }
                .btn a {
                background-color: #3e8dc6;
                border: solid 1px #3e8dc6;
                border-radius: 5px;
                box-sizing: border-box;
                color: #e3d76e;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize; }
        
            .btn-primary table td {
                background-color: #3e8dc6; }
        
            .btn-primary a {
                background-color: #3e8dc6;
                border-color: #3e8dc6;
                color: #e3d76e; }
        
            /* -------------------------------------
                OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
                margin-bottom: 0; }
        
            .first {
                margin-top: 0; }
        
            .align-center {
                text-align: center; }
        
            .align-right {
                text-align: right; }
        
            .align-left {
                text-align: left; }
        
            .clear {
                clear: both; }
        
            .mt0 {
                margin-top: 0; }
        
            .mb0 {
                margin-bottom: 0; }
        
            .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0; }
        
            .powered-by a {
                text-decoration: none; }
        
            hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                Margin: 20px 0; }
        
            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important; }
                table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
                font-size: 16px !important; }
                table[class=body] .wrapper,
                table[class=body] .article {
                padding: 10px !important; }
                table[class=body] .content {
                padding: 0 !important; }
                table[class=body] .container {
                padding: 0 !important;
                width: 100% !important; }
                table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important; }
                table[class=body] .btn table {
                width: 100% !important; }
                table[class=body] .btn a {
                width: 100% !important; }
                table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important; }}
        
            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
                .ExternalClass {
                width: 100%; }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                line-height: 100%; }
                .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important; }
                .btn-primary table td:hover {
                background-color: #34495e !important; }
                .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important; } }
            
            .btn {
                -webkit-border-radius: 5;
                -moz-border-radius: 5;
                border-radius: 5px;
                font-family: Arial;
                color: #e3d76e;
                font-size: 16px;
                font-weight: 'bold' !important;
                background: #3e8dc6;
                padding: 13px 50px 13px 50px;
                text-decoration: none;
            }
        
            .btn:hover {
                background: #29618a;
                color: #f9f1a8;
                text-decoration: none;
            }
            </style>
        </head>
        <body class="">
            <table border="0" cellpadding="0" cellspacing="0" class="body">
            <tr>
                <td>&nbsp;</td>
                <td class="container">
                <div class="content">
        
                    <table class="main">
        
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                            <td>
                                <p>Dear<strong> ${data.member_name} </strong>,</p>
                                <p>Berikut kode OTP anda</p>
                                <br>
                                <p><b><h1>${data.otp_code}</h1></b></p>
                                <br>
                                <center><p><h4>expired otp: ${data.expired}</h4></p></cennter>
                                <br>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
        
                    <!-- END MAIN CONTENT AREA -->
                    </table>
        
                <!-- END CENTERED WHITE CONTAINER -->
                </div>
                </td>
                <td>&nbsp;</td>
            </tr>
            </table>
        </body>
        </html>
    `;
  return content;
};

const templateEmailForgotPassword = (url, memberName) => {
  let content = `
        <!doctype html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Cloud Ticketing System</title>
            <style>
            /* -------------------------------------
                GLOBAL RESETS
            ------------------------------------- */
            img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%; }

            body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%; }

            table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%; }
                table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top; }

            /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */

            .body {
                background-color: #f6f6f6;
                width: 100%; }

            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
                display: block;
                Margin: 0 auto !important;
                /* makes it centered */
                max-width: 680px;
                padding: 10px;
                width: 680px; }

            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
                box-sizing: border-box;
                display: block;
                Margin: 0 auto;
                max-width: 680px;
                padding: 10px; }

            /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%; }

            .wrapper {
                box-sizing: border-box;
                padding: 20px; }

            .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
            }

            .footer {
                clear: both;
                Margin-top: 10px;
                text-align: center;
                width: 100%; }
                .footer td,
                .footer p,
                .footer span,
                .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center; }

            /* -------------------------------------
                TYPOGRAPHY
            ------------------------------------- */
            h1,
            h2,
            h3,
            h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                Margin-bottom: 30px; }

            h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize; }

            p,
            ul,
            ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                Margin-bottom: 15px; }
                p li,
                ul li,
                ol li {
                list-style-position: inside;
                margin-left: 5px; }

            a {
                color: #3498postgres;
                text-decoration: underline; }

            /* -------------------------------------
                BUTTONS
            ------------------------------------- */
            .btn {
                box-sizing: border-box;
                width: 100%; }
                .btn > tbody > tr > td {
                padding-bottom: 15px; }
                .btn table {
                width: auto; }
                .btn table td {
                background-color: #ffffff;
                border-radius: 5px;
                text-align: center; }
                .btn a {
                background-color: #ffffff;
                border: solid 1px #3498postgres;
                border-radius: 5px;
                box-sizing: border-box;
                color: #3498postgres;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize; }

            .btn-primary table td {
                background-color: #3498postgres; }

            .btn-primary a {
                background-color: #3498postgres;
                border-color: #3498postgres;
                color: #ffffff; }

            /* -------------------------------------
                OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
                margin-bottom: 0; }

            .first {
                margin-top: 0; }

            .align-center {
                text-align: center; }

            .align-right {
                text-align: right; }

            .align-left {
                text-align: left; }

            .clear {
                clear: both; }

            .mt0 {
                margin-top: 0; }

            .mb0 {
                margin-bottom: 0; }

            .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0; }

            .powered-by a {
                text-decoration: none; }

            hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                Margin: 20px 0; }

            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important; }
                table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
                font-size: 16px !important; }
                table[class=body] .wrapper,
                table[class=body] .article {
                padding: 10px !important; }
                table[class=body] .content {
                padding: 0 !important; }
                table[class=body] .container {
                padding: 0 !important;
                width: 100% !important; }
                table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important; }
                table[class=body] .btn table {
                width: 100% !important; }
                table[class=body] .btn a {
                width: 100% !important; }
                table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important; }}

            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
                .ExternalClass {
                width: 100%; }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                line-height: 100%; }
                .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important; }
                .btn-primary table td:hover {
                background-color: #34495e !important; }
                .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important; } }
            
                .btn {
                -webkit-border-radius: 5;
                -moz-border-radius: 5;
                border-radius: 5px;
                font-family: Arial;
                color: #e3d76e;
                font-size: 16px;
                font-weight: 'bold' !important;
                background: #3e8dc6;
                padding: 13px 50px 13px 50px;
                text-decoration: none;
            }

            .btn:hover {
                background: #29618a;
                color: #f9f1a8;
                text-decoration: none;
            }
            </style>
        </head>
        <body class="">
            <table border="0" cellpadding="0" cellspacing="0" class="body">
            <tr>
                <td>&nbsp;</td>
                <td class="container">
                <div class="content">

                    <table class="main">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                            <td>
                                <p>Dear <strong>${memberName}</strong>,</p>
                                <p>Kami telah menerima permintaanmu untuk melakukan reset password. Silahkan klik tombol di bawah untuk melanjutkan.</p>
                                <br /> 
                                <p style="text-align: center;"><a href="${url}" class="btn">Reset Password</a></p>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                    </table>

                <!-- END CENTERED WHITE CONTAINER -->
                </div>
                </td>
                <td>&nbsp;</td>
            </tr>
            </table>
        </body>
        </html>
    `;

  return content;
};

module.exports = {
  sendMailRegister,
  sendMailOTP,
  sendMailForgotPassword,
};

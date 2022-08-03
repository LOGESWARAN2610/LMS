const express = require(`express`);
const sql = require(`mssql/msnodesqlv8`);
const app = express();
const cors = require(`cors`);
const fs = require('fs');
var bodyParser = require(`body-parser`);
const Port = 4001;

app.use(cors({
    origin: `*`,
    credentials: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ limit: `50mb` }));
const config = {
    database: `AnalyticBrains`,
    server: `localhost`,
    options: {
        trustedConnection: true
    }
};
// app.use(bodyParser.json({ type: `application/json` }));
app.post(`/`, function (req, res) {
    new sql.ConnectionPool(config).connect().then(pool => {
        // console.log(req.body.query);
        return pool.request().query(req.body.query)
    }).then(result => {
        res.send(result[`recordsets`]);
        sql.close();
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: `${err}` })
        sql.close();
    });
});

app.post('/Update', function (req, res) {
    new sql.ConnectionPool(config).connect().then(pool => {
        var request = pool.request();
        request.input('Json', sql.VarChar(8000), req.body.UpdateJson);
        return request.execute(req.body.SP);
    }).then(result => {
        res.status(200).send(result);
        sql.close();
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: "${err}" })
        sql.close();
    });

});
app.post('/query', function (req, res) {
    return query(req.body.query)

});
app.post('/Upload', function (req, res) {
    // console.log(req.body.img);
    var img = req.body.img.replace('data:image/png;base64,', '');
    fs.writeFile('../src/images/Profile_' + req.body.EmpId + '.png', img, 'base64', function (err) {
        if (err)
            console.log('Error During Image Upload ', err);
    });


});
app.post('/Email', function (req, res) {
    require('dotenv').config()
    const nodemailer = require('nodemailer');
    console.log(process.env.APP_EMAIL, process.env.APP_EMAIL_PASS);
    const mailService = (toEmail, subject, content, copyTo) => {
        console.log(toEmail);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_EMAIL_PASS
            }
        });
        const mailOptions = {
            from: '"Analytic Brains" <' + process.env.APP_EMAIL + '>',
            to: toEmail,
            cc: copyTo,
            subject: subject,
            html: '<h1>' + content + '</h1>'
        };
        const newTransportPromise = new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) =>
                error ? reject(error) : resolve(info)
            )
        });
        console.log('Mail Sent Successfully...!!!');
        query('Update EmployeeDetails SET OTP=' + content + ' WHERE EmpId=' + req.body.EmpId)

        return newTransportPromise;
    }
    mailService(req.body.EmailTo, 'LMS - Reset Password', getOTP(), 'logeswaran28051999@gmail.com');
});
const getOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
}
const query = (query) => {
    console.log(query)
    var conn = new sql.ConnectionPool(config);
    conn.connect(function (err) {
        if (err) console.log(err);
        var req = new sql.Request(conn);
        return req.query(query, function (err, recordset) {
            if (err) console.log(err);
            else return recordset['recordsets'];
            conn.close();
        });
    });
}
const server = app.listen(Port, function () {
    console.log(`MySelf Server Running on Port : ${Port}`);
});
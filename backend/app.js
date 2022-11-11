// reference : https://codex.so/handling-any-post-data-in-express
// https://www.tutorialspoint.com/expressjs/expressjs_form_data.htm

const express = require('express');
const mogoose = require("mongoose");


const userRoutes = require("./routes/users");
const statusRoutes = require("./routes/status");
const gdriveRoutes = require("./routes/gdrives");
const typeRoutes = require("./routes/types");
const customerRoutes = require("./routes/customers");
const modelRoutes = require("./routes/models");
const orderRoutes = require("./routes/orders");
const organizationRoutes = require("./routes/organizations");

const app = express();

mogoose.connect("mongodb+srv://moin:"+process.env.MONGO_ALTAS_PW+"@cluster0.tmxel.mongodb.net/zigma", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//middleware
//Adding middleware to resolve CORS problem
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});
// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//       next();
//     });



app.use("/api/status",statusRoutes);
app.use("/api/users",userRoutes);
app.use("/api/gdrives",gdriveRoutes);
app.use("/api/organizations",organizationRoutes);
app.use("/api/types",typeRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/models",modelRoutes);
app.use("/api/orders",orderRoutes);

app.use((req, res, next)=>{
    res.send('Hello From Express')
});

module.exports = app;
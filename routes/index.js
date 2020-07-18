const passport = require("passport");
const scope = require("../app/middlewares/scope");
const decryptToken = require("../app/middlewares/decrypt-token");
const facebook = require("./facebook");
const auth = require("./auth");
const product = require("./product");
const user = require("./user");
const session = require("./session");
const cart = require("./cart");
const checkout = require("./checkout");
const buyer = require("./buyer");
const authbuyer = require("./authbuyer");
const payment = require("./payment");
const promo = require("./promo");
const delivery = require("./delivery");
const paymentOption = require("./payment-option");
const business = require("./business");
const deliveryStatus = require("./delivery-status");
const paymentGateway = require("./payment_gateway");
const sandbox = require("./sandbox");
const webhooks = require("./webhooks");
const tag = require("./tag");
const path = require("path");

module.exports = (app) => {
    /* GET home page. */
    app.get("/", function (req, res, next) {
        res.render("index", {
            title: "Upmesh API",
            env: process.env.NODE_ENV,
            port: process.env.PORT,
            version: process.env.VERSION,
        });
        // res.sendFile(path.join(__dirname,'..','efs','index.html'));
    });

    app.use("/webhooks", webhooks);

    // authentication
    app.use("/auth", auth);
    app.use("/buyers/auth", authbuyer);
    app.use(
        "/users",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        user
    );
    app.use(
        "/buyers",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        buyer
    );

    // seller
    app.use(
        "/facebooks",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        facebook
    );
    app.use(
        "/products",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        product
    );
    app.use(
        "/sessions",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        session
    );
    app.use(
        "/businesses",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        scope,
        business
    );
    app.use("/promos", promo);
    app.use("/payment_options", paymentOption);
    app.use("/sandbox", sandbox);
    // buyer
    app.use("/carts", cart);
    app.use("/checkouts", checkout);
    app.use("/payments", payment);
    app.use("/deliveries", delivery);
    app.use("/delivery_statuses", deliveryStatus);
    // payment gateway
    app.use("/payment_gateway", paymentGateway);

    // tag
    app.use(
        "/tag",
        decryptToken,
        passport.authenticate("jwt", {session: false}),
        tag
    );
};

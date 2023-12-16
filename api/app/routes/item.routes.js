const { authJwt } = require("../middlewares");
const controller = require("../controllers/item.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/items/add", [authJwt.verifyToken], controller.add);
    app.get("/api/items/view/:id", [authJwt.verifyToken], controller.view);
    app.put("/api/items/update/:id", [authJwt.verifyToken], controller.update);
    app.delete("/api/items/delete/:id", [authJwt.verifyToken], controller.delete);
    app.post("/api/items/list", [authJwt.verifyToken], controller.list);
};

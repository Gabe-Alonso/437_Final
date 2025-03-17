"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerImageRoutes = registerImageRoutes;
const ImageProvider_1 = require("../ImageProvider");
const ImageUploadMiddleware_1 = require("../ImageUploadMiddleware");
function registerImageRoutes(app, mongoClient) {
    app.get("/api/images", async (req, res) => {
        try {
            let userId = undefined;
            if (typeof req.query.createdBy === "string") {
                userId = req.query.createdBy;
            }
            console.log(userId);
            const imageProvider = new ImageProvider_1.ImageProvider(mongoClient);
            const images = await imageProvider.getAllImages(userId);
            res.json(images);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.patch("/api/images/:id", async (req, res) => {
        try {
            if (req.body.name === undefined || req.body.name === "") {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing name property"
                });
            }
            else {
                console.log("Request received for image ID:", req.params.id);
                console.log("Request received for new name:", req.body.name);
                // Your logic to handle the patch request goes here
                const imageProvider = new ImageProvider_1.ImageProvider(mongoClient);
                const imagesMatched = await imageProvider.updateImageName(req.params.id, req.body.name);
                if (imagesMatched == 0) {
                    res.status(404).send({
                        error: "Not found",
                        message: "Image does not exist"
                    });
                }
                else {
                    res.status(204).send("No content");
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.post("/api/images", ImageUploadMiddleware_1.imageMiddlewareFactory.single("image"), // Multer middleware
    ImageUploadMiddleware_1.handleImageFileErrors, // Error handling middleware
    async (req, res) => {
        console.log("In post request", req.file, req.body);
        if (!req.file || !req.body.title) {
            res.status(400).json({
                error: "Bad Request",
                message: "Missing required fields: image and title."
            });
            return; // Explicitly return `void`
        }
        const _id = req.file.filename;
        const src = `/uploads/${_id}`;
        const name = req.body.title;
        const author = res.locals.token.username;
        console.log(_id, src, name, author);
        const imageProvider = new ImageProvider_1.ImageProvider(mongoClient);
        console.log("creating image");
        const imageAdded = await imageProvider.createImage(_id, src, name, author);
        res.status(201).send();
        return; // Ensure function returns `void`
    });
}

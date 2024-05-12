import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { uploadFile } from "./aws";
// uploadFile("dhanush/package.json", "/home/dhanush/Desktop/Hello/projects/vercel/dist/src/output/E3ILs/package.json");
import { getAllFiles } from "./file";
import { createClient } from "redis";


const publisher = createClient();
publisher.connect();
const subscriber = createClient();
publisher.connect();


const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("root");
});


app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate(); // asd12
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({
        id: id
    })

});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);
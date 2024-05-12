import { S3 } from "aws-sdk";
import fs from "fs";


const s3 = new S3({ // add your credentials here either from aws or cloudflare or any other provider
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/dhanush/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}
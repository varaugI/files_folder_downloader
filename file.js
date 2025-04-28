const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadFile = async (url, outputPath) => {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const downloadFolder = async (baseUrl, folderPath) => {
   
    const files = ['file1.txt', 'file2.txt']; 

    for (const file of files) {
        const fileUrl = path.join(baseUrl, file);
        const outputPath = path.join(folderPath, file);
        console.log(`Downloading ${fileUrl} to ${outputPath}`);
        await downloadFile(fileUrl, outputPath);
    }
};

const main = async () => {
    const baseUrl = ''; 
    const outputFolder = './downloaded';

    if (!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }

    await downloadFolder(baseUrl, outputFolder);
    console.log('All files downloaded successfully!');
};

main().catch(console.error);

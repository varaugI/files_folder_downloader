const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const downloadFile = async (url, outputPath) => {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const fetchFileList = async (baseUrl) => {
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    const files = [];

    $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href && !href.endsWith('/')) {
            files.push(href);
        }
    });

    return files;
};

const downloadFolder = async (baseUrl, outputPath) => {
    const files = await fetchFileList(baseUrl);
    console.log(`Found ${files.length} files to download...`);

    for (const file of files) {
        const fileUrl = new URL(file, baseUrl).href; // Ensure full URL
        const outputFilePath = path.join(outputPath, path.basename(file));
        console.log(`Downloading ${fileUrl} to ${outputFilePath}`);
        await downloadFile(fileUrl, outputFilePath);
    }
};

const main = async () => {
    const baseUrl = '';
    const outputFolder = './downloaded'; // Local folder to save files.

    if (!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }

    await downloadFolder(baseUrl, outputFolder);
    console.log('All files downloaded successfully!');
};

main().catch(console.error);

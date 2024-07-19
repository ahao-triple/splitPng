const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logs = require('./logs');
const detectRegion = require('./detectRegion');
const validateRegion = require('./validateRegion');

// 确保目录存在
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// 读取图片并拆分
async function splitImage() {
    const inputPath = path.join(config.inputDir, config.inputFile);
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height, channels } = metadata;

    logs.log(`Image dimensions: ${width}x${height}, channels: ${channels}`);

    // 获取图片像素数据
    const buffer = await image.raw().toBuffer();
    const pixelData = new Uint8Array(buffer);

    // 分析图片，查找有效区域
    const regions = detectRegion(pixelData, width, height, channels);

    // 创建输出目录
    ensureDirectoryExistence(config.outputDir);

    // 拆分并保存图片
    await Promise.all(regions.map((region, index) => {
        const outputPath = path.join(config.outputDir, `output_${index}.png`);
        logs.logRegion(index, region);
        if (validateRegion(region, width, height)) {
            logs.log(`Region ${index} details before extraction: ${JSON.stringify(region)}`);
            return image.clone().extract(region).toFormat('png').toFile(outputPath)
                .then(() => {
                    logs.log(`Successfully saved region ${index}`);
                })
                .catch(err => {
                    logs.logError(index, err);
                });
        } else {
            logs.logError(index, `Invalid region: ${JSON.stringify(region)}`);
        }
    }));
}

// 示例调用
splitImage().then(() => {
    logs.log('Image split successfully.');
}).catch(err => {
    logs.logError('General', err);
});

// 检测单个区域的函数
function detectRegion(pixelData, width, height, startX, startY, channels, visited) {
    const queue = [{ x: startX, y: startY }];
    let minX = startX, maxX = startX, minY = startY, maxY = startY;

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        const index = (y * width + x) * channels;

        if (x >= 0 && x < width && y >= 0 && y < height && !visited[y * width + x] && pixelData[index + 3] > 0) {
            visited[y * width + x] = true;

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);

            queue.push({ x: x + 1, y });
            queue.push({ x: x - 1, y });
            queue.push({ x, y: y + 1 });
            queue.push({ x, y: y - 1 });
        }
    }

    if (minX <= maxX && minY <= maxY) {
        const region = {
            left: minX,
            top: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };

        if (isValidRegion(region, width, height)) {
            return region;
        }
    }

    return null;
}

// 验证区域是否有效
function isValidRegion(region, width, height) {
    const isValid = region.left >= 0 && region.top >= 0 &&
           region.left + region.width <= width &&
           region.top + region.height <= height &&
           region.width > 0 && region.height > 0;

    if (!isValid) {
        console.error('Invalid region detected:', region);
    }

    return isValid;
}

// 查找有效区域的函数
function findRegions(pixelData, width, height, channels) {
    const regions = [];
    const visited = new Array(width * height).fill(false);

    // 遍历每个像素
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * channels;

            // 判断是否为非透明像素
            if (!visited[y * width + x] && pixelData[index + 3] > 0) {
                // 开始新的区域检测
                const region = detectRegion(pixelData, width, height, x, y, channels, visited);
                if (region) {
                    regions.push(region);
                }
            }
        }
    }

    return regions;
}

module.exports = findRegions;

const express = require('express');
const si = require('systeminformation');
const router = express.Router();

router.get('/status', async (req, res) => {
    try {
        // Lấy trạng thái CPU
        const cpuLoad = await si.currentLoad();
        const cpuTemp = await si.cpuTemperature();
        
        // Lấy trạng thái RAM
        const ram = await si.mem();
        const totalRam = (ram.total / 1024 / 1024 / 1024).toFixed(2); // GB
        const usedRam = (ram.active / 1024 / 1024 / 1024).toFixed(2); // GB

        // Lấy trạng thái ổ đĩa
        const diskUsage = await si.fsSize();
        const usedDisk = (diskUsage[0].used / 1024 / 1024 / 1024).toFixed(2); // GB
        const totalDisk = (diskUsage[0].size / 1024 / 1024 / 1024).toFixed(2); // GB

        // Chuẩn bị thông tin trả về
        const systemStatus = {
            cpuUsage: `${cpuLoad.currentLoad.toFixed(2)}%`,  // Tải CPU hiện tại
            cpuTemp: `${cpuTemp.main}°C`,  // Nhiệt độ CPU
            ramUsage: `${usedRam}GB / ${totalRam}GB`,  // Sử dụng RAM
            diskUsage: `${usedDisk}GB / ${totalDisk}GB`  // Sử dụng đĩa
        };

        res.status(200).json({ systemStatus });
    } catch (error) {
        console.error('Error retrieving system status:', error);
        res.status(500).json({ error: 'Failed to retrieve system status' });
    }
});

module.exports = router;

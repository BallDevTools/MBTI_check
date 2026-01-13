module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const JSONBIN_API_KEY = '$2a$10$VGZjLDJQe1/WSm7qkgtQLOomSVydqa87D1PuaRB6A7Atja/cjBEHm'; // เปลี่ยนตรงนี้
    const BIN_ID = '6948332743b1c97be9fd22d7'; // เปลี่ยนตรงนี้

    // ดึงข้อมูลจาก JSONBin
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(200).json({
        success: true,
        totalResponses: 0,
        personalityCount: {},
        dimensionCount: {},
        lastUpdate: null
      });
    }

    const binData = await response.json();
    const data = binData.record || { responses: [], totalResponses: 0 };

    if (!data.responses || data.responses.length === 0) {
      return res.status(200).json({
        success: true,
        totalResponses: 0,
        personalityCount: {},
        dimensionCount: {},
        lastUpdate: null
      });
    }

    // นับจำนวนบุคลิกภาพแต่ละประเภท
    const personalityCount = {};
    const dimensionCount = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    data.responses.forEach(response => {
      const type = response.personalityType;
      
      // นับบุคลิกภาพ
      personalityCount[type] = (personalityCount[type] || 0) + 1;
      
      // นับมิติ
      if (type) {
        for (let char of type) {
          if (dimensionCount.hasOwnProperty(char)) {
            dimensionCount[char]++;
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      totalResponses: data.totalResponses,
      personalityCount: personalityCount,
      dimensionCount: dimensionCount,
      lastUpdate: data.responses[data.responses.length - 1].timestamp
    });

  } catch (error) {
    console.error('Error reading personality results:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message
    });
  }
};
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
    const GITHUB_TOKEN = "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";
    const REPO_OWNER = process.env.REPO_OWNER || 'BallDevTools'; // เปลี่ยนตรงนี้
    const REPO_NAME = process.env.REPO_NAME || 'MBTI_check'; // เปลี่ยนตรงนี้
    const FILE_PATH = 'data/personality-responses.json';

    const getFileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    const response = await fetch(getFileUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
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

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const data = JSON.parse(content);

    if (!data.responses || data.responses.length === 0) {
      return res.status(200).json({
        success: true,
        totalResponses: 0,
        personalityCount: {},
        dimensionCount: {},
        lastUpdate: null
      });
    }

    // Count personality types
    const personalityCount = {};
    const dimensionCount = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    data.responses.forEach(response => {
      const type = response.personalityType;
      
      // Count personality types
      personalityCount[type] = (personalityCount[type] || 0) + 1;
      
      // Count dimensions
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
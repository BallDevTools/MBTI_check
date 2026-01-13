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
    return res.status(405).send('Method not allowed');
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER || 'YOUR_GITHUB_USERNAME'; // เปลี่ยนตรงนี้
    const REPO_NAME = process.env.REPO_NAME || 'personality-test'; // เปลี่ยนตรงนี้
    const FILE_PATH = 'data/personality-responses.json';

    const getFileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    const response = await fetch(getFileUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return res.status(404).send('ไม่พบข้อมูล');
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const data = JSON.parse(content);
    
    if (!data.responses || data.responses.length === 0) {
      return res.status(404).send('ไม่พบข้อมูล');
    }

    // Create CSV header
    let csv = 'ID,Timestamp,PersonalityType,E,I,S,N,T,F,J,P';
    
    // Add all question columns
    for (let i = 1; i <= 20; i++) {
      csv += `,Q${i}`;
    }
    csv += '\n';
    
    // Add data rows
    data.responses.forEach(response => {
      const row = [
        response.id,
        response.timestamp,
        response.personalityType,
        response.scores.E || 0,
        response.scores.I || 0,
        response.scores.S || 0,
        response.scores.N || 0,
        response.scores.T || 0,
        response.scores.F || 0,
        response.scores.J || 0,
        response.scores.P || 0
      ];

      // Add all answers
      for (let i = 1; i <= 20; i++) {
        row.push(response.answers[`q${i}`] || '');
      }
      
      csv += row.join(',') + '\n';
    });

    // Add UTF-8 BOM for Thai language support in Excel
    const csvWithBOM = '\uFEFF' + csv;

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="personality-test-results-${Date.now()}.csv"`);
    
    return res.status(200).send(csvWithBOM);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).send('เกิดข้อผิดพลาดในการ Export ข้อมูล: ' + error.message);
  }
};
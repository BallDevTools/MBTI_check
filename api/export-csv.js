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
    const JSONBIN_API_KEY = '$2a$10$VGZjLDJQe1/WSm7qkgtQLOomSVydqa87D1PuaRB6A7Atja/cjBEHm'; // เปลี่ยนตรงนี้
    const BIN_ID =  '6948332743b1c97be9fd22d7'; // เปลี่ยนตรงนี้

    // ดึงข้อมูลจาก JSONBin
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(404).send('ไม่พบข้อมูล');
    }

    const binData = await response.json();
    const data = binData.record || { responses: [], totalResponses: 0 };
    
    if (!data.responses || data.responses.length === 0) {
      return res.status(404).send('ไม่พบข้อมูล');
    }

    // สร้าง CSV header
    let csv = 'ID,Timestamp,PersonalityType,E,I,S,N,T,F,J,P';
    
    // เพิ่มคอลัมน์คำถาม
    for (let i = 1; i <= 20; i++) {
      csv += `,Q${i}`;
    }
    csv += '\n';
    
    // เพิ่มข้อมูลแต่ละแถว
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

      // เพิ่มคำตอบทุกข้อ
      for (let i = 1; i <= 20; i++) {
        row.push(response.answers[`q${i}`] || '');
      }
      
      csv += row.join(',') + '\n';
    });

    // เพิ่ม UTF-8 BOM สำหรับภาษาไทยใน Excel
    const csvWithBOM = '\uFEFF' + csv;

    // ตั้งค่า headers สำหรับดาวน์โหลดไฟล์
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="personality-test-results-${Date.now()}.csv"`);
    
    return res.status(200).send(csvWithBOM);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).send('เกิดข้อผิดพลาดในการ Export ข้อมูล: ' + error.message);
  }
};
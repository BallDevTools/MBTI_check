module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { answers, result } = req.body;

    if (!answers || Object.keys(answers).length !== 20) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณาตอบคำถามให้ครบทุกข้อ' 
      });
    }

    if (!result || !result.type) {
      return res.status(400).json({ 
        success: false, 
        message: 'ข้อมูลผลลัพธ์ไม่ถูกต้อง' 
      });
    }

    // ตั้งค่า JSONBin
    const JSONBIN_API_KEY = '$2a$10$VGZjLDJQe1/WSm7qkgtQLOomSVydqa87D1PuaRB6A7Atja/cjBEHm'; // เปลี่ยนตรงนี้
    const BIN_ID =  '6948332743b1c97be9fd22d7'; // เปลี่ยนตรงนี้

    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === '$2a$10$VGZjLDJQe1/WSm7qkgtQLOomSVydqa87D1PuaRB6A7Atja/cjBEHm') {
      return res.status(500).json({ 
        success: false, 
        message: 'ไม่พบ JSONBIN_API_KEY กรุณาตั้งค่าใน Vercel Environment Variables' 
      });
    }

    // ดึงข้อมูลปัจจุบันจาก JSONBin
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });

    if (!getResponse.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลจาก JSONBin ได้');
    }

    const binData = await getResponse.json();
    const currentData = binData.record || { responses: [], totalResponses: 0 };

    // เพิ่มข้อมูลใหม่
    const newResponse = {
      id: currentData.totalResponses + 1,
      timestamp: new Date().toISOString(),
      personalityType: result.type,
      scores: result.scores,
      answers: answers
    };

    currentData.responses.push(newResponse);
    currentData.totalResponses = currentData.responses.length;

    // บันทึกกลับไปที่ JSONBin
    const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(currentData)
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error('ไม่สามารถบันทึกข้อมูลได้: ' + JSON.stringify(errorData));
    }

    return res.status(200).json({ 
      success: true, 
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      responseId: newResponse.id,
      personalityType: result.type
    });

  } catch (error) {
    console.error('Error saving personality test:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message
    });
  }
};
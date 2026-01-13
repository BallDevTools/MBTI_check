# แบบสำรวจความคิดเห็น (Survey Form)

แบบฟอร์มสำรวจความคิดเห็นพร้อมระบบให้คะแนน 1-5 ดาว และหน้ารายงานสำหรับผู้ดูแลระบบ

## ฟีเจอร์

### สำหรับผู้ใช้ (survey-form.html)
- ✅ ฟอร์มสำรวจ 10 คำถาม
- ✅ ระบบให้คะแนนแบบดาว (1-5 ดาว)
- ✅ UI สวยงามด้วย Bootstrap 5
- ✅ Responsive Design
- ✅ Modal ขอบคุณหลังกรอกเสร็จ
- ✅ Validation ครบทุกคำถาม
- ✅ Animation และ Hover Effects

### สำหรับผู้ดูแล (admin-report.html)
- ✅ สถิติภาพรวม (จำนวนผู้ตอบ, คะแนนเฉลี่ย, เวลาอัพเดท)
- ✅ กราฟแท่งแสดงการกระจายคะแนนแต่ละคำถาม
- ✅ คะแนนเฉลี่ย/มัธยฐาน ของแต่ละคำถาม
- ✅ Progress Bar แสดงเปอร์เซ็นต์
- ✅ Auto-refresh ทุก 30 วินาที
- ✅ Export ข้อมูลเป็น CSV
- ✅ Chart.js สำหรับกราฟสวยงาม

## โครงสร้างไฟล์

```
project/
├── survey-form.html          # หน้าฟอร์มสำหรับผู้ตอบ
├── admin-report.html         # หน้ารายงานสำหรับผู้ดูแล
├── api/
│   ├── submit-survey.js      # API บันทึกคำตอบ
│   ├── get-survey-results.js # API ดึงข้อมูลรายงาน
│   └── export-csv.js         # API Export CSV
├── data/
│   └── survey-responses.json # ฐานข้อมูล JSON
├── vercel.json               # การตั้งค่า Vercel
├── package.json              # Node.js dependencies
└── README.md                 # เอกสารนี้
```

## การติดตั้งและ Deploy บน Vercel

### วิธีที่ 1: ใช้ Vercel CLI (แนะนำ)

1. **ติดตั้ง Vercel CLI**
```bash
npm install -g vercel
```

2. **Login เข้า Vercel**
```bash
vercel login
```

3. **Deploy โปรเจค**
```bash
cd /path/to/your/project
vercel
```

4. **ทดสอบบน Local (ถ้าต้องการ)**
```bash
vercel dev
```

### วิธีที่ 2: ใช้ Vercel Dashboard

1. ไปที่ https://vercel.com และ Login
2. กด "Add New Project"
3. เลือก "Import Git Repository" หรือ Upload โฟลเดอร์
4. Vercel จะ Auto-detect และ Deploy ให้อัตโนมัติ

### Environment Setup

ไม่ต้องตั้งค่า Environment Variables เพิ่มเติม เพราะใช้ JSON file เก็บข้อมูล

## การใช้งาน

### สำหรับผู้ตอบแบบสำรวจ

1. เข้าหน้าฟอร์ม: `https://your-domain.vercel.app/`
2. กรอกแบบสำรวจให้ครบ 10 คำถาม (คลิกดาวเพื่อให้คะแนน)
3. กดปุ่ม "ส่งแบบสำรวจ"
4. จะเห็น Modal ขอบคุณหลังส่งสำเร็จ

### สำหรับผู้ดูแลระบบ

1. เข้าหน้ารายงาน: `https://your-domain.vercel.app/admin`
2. ดูสถิติและกราฟการตอบแบบสำรวจ
3. กด "รีเฟรชข้อมูล" เพื่ออัพเดทข้อมูลล่าสุด
4. กด "ดาวน์โหลด CSV" เพื่อ Export ข้อมูล

## API Endpoints

### POST /api/submit-survey
บันทึกคำตอบแบบสำรวจ

**Request Body:**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "answers": {
    "q1": 5,
    "q2": 4,
    "q3": 5,
    "q4": 3,
    "q5": 4,
    "q6": 5,
    "q7": 5,
    "q8": 4,
    "q9": 3,
    "q10": 4
  }
}
```

### GET /api/get-survey-results
ดึงข้อมูลสถิติและรายงาน

**Response:**
```json
{
  "success": true,
  "results": {
    "totalResponses": 10,
    "overallAverage": 4.2,
    "lastUpdate": "2024-01-01T12:00:00.000Z",
    "questions": [...]
  }
}
```

### GET /api/export-csv
Export ข้อมูลเป็น CSV file

## คำถามในแบบสำรวจ

1. คิดว่าราคา 59 บาทคุ้มค่าไหม
2. คิดว่าจำนวนผู้ใช้ในแอพสำคัญต่อการตัดสินใจที่จะสมัครแอพไหม
3. คิดว่าระบบยืนยันตัวตนผู้ใช้มีความสำคัญมากน้อยแค่ไหนในการหาคู่
4. คุณคิดว่าระบบจับคู่ที่เน้นความสนใจและงานอดิเรกเฉพาะทางมีความสำคัญมากน้อยเพียงใด
5. คุณคิดว่าระบบรีวิวและให้คะแนนผู้ใช้/กิจกรรมมีความสำคัญมากน้อยเพียงใด?
6. ความปลอดภัยข้อมูลของผู้ใช้สำคัญมากน้อยแค่ไหน
7. คุณคิดว่าการมีผู้ดูแลที่คอยตรวจสอบเนื้อหาและพฤติกรรมที่ไม่เหมาะสมมีความสำคัญมากไหม
8. ฟีเจอร์ในการส่งข้อความเพื่อเปิดบทสนทนามีความสำคัญมากน้อยแค่ไหน
9. คุณคิดว่าตัวกรองตามช่วงอายุที่ไม่ห่างจากตัวเอง 2-3 ปีมีความสำคัญมากน้อยเพียงใด
10. คุณคิดว่าการแสดงจำนวนเพื่อน/กิจกรรมที่เคยเข้าร่วมบนโปรไฟล์มีความสำคัญมากน้อยเพียงใด?

## เทคโนโลยีที่ใช้

- **Frontend:** HTML5, Bootstrap 5, Font Awesome, Chart.js
- **Backend:** Node.js (Vercel Serverless Functions)
- **Database:** JSON File Storage
- **Hosting:** Vercel
- **Styling:** Custom CSS with Gradient Effects

## การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขใน CSS ส่วน gradient:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### เพิ่ม/ลดคำถาม
1. แก้ไขใน `survey-form.html` เพิ่ม/ลด question blocks
2. แก้ไข validation ในส่วน JavaScript
3. แก้ไข array `questions` ใน `admin-report.html`
4. อัพเดท API endpoints ให้รองรับจำนวนคำถามใหม่

## ข้อควรระวัง

- ⚠️ JSON file storage เหมาะสำหรับข้อมูลไม่มาก ถ้ามีผู้ตอบเยอะ ควรใช้ Database จริง
- ⚠️ ไม่มีระบบ Authentication สำหรับหน้า Admin ควรเพิ่มการป้องกัน
- ⚠️ ควรเพิ่ม Rate Limiting เพื่อป้องกัน Spam

## License

MIT License - ใช้งานได้อย่างอิสระ

## ติดต่อ

หากมีปัญหาหรือข้อสงสัย สามารถสอบถามได้
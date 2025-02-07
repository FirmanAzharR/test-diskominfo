const request = require('supertest');

const app = require('../src/app');

describe('GET /user-courses/mentor-fee', () => {
    const expectResult = {
        "status": 200,
        "message": "Get Data Mentor Success",
        "result": [
            {
                "mentor": "Cania",
                "jumlah_pesesrta": "6",
                "total_fee": "12000000"
            },
            {
                "mentor": "Ari",
                "jumlah_pesesrta": "6",
                "total_fee": "12000000"
            },
            {
                "mentor": "Barry",
                "jumlah_pesesrta": "4",
                "total_fee": "8000000"
            },
            {
                "mentor": "Darren",
                "jumlah_pesesrta": "2",
                "total_fee": "4000000"
            }
        ]
    }
  it('should return a 200 status and a message', async () => {
    const response = await request(app).get('/user-courses/mentor-fee'); 
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Get Data Mentor Success")
    expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectResult));
  });
});


describe('POST /user-courses/all', () => {
  it('should return a 422 status and a message', async () => {
    const response = await request(app).post('/user-courses/all'); 
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(422);
    expect(response.body.message).toBe('"jenis_mentor" is required')
    // console.log(response.body)
  });
});
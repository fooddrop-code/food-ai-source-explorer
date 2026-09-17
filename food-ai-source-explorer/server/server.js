const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/health", function (request, response) {
  response.json({
    message: "식품 원재료 탐색기 서버가 실행 중입니다."
  });
});

app.get("/api/ingredients", async function (request, response) {
  const query = request.query.q?.trim();

  if (!query) {
    return response.status(400).json({
      error: "검색어를 입력해 주세요."
    });
  }

  const parameters = new URLSearchParams({
    serviceKey: process.env.FOOD_API_KEY,
    type: "json",
    pageNo: "1",
    numOfRows: "10",
    rprsnt_rawmtrl_nm: query
  });

  const apiUrl =
    "https://apis.data.go.kr/1471000/FoodRwmatrInfoService01/getFoodRwmatrList01";

  try {
    const apiResponse = await fetch(`${apiUrl}?${parameters}`);

    if (!apiResponse.ok) {
      throw new Error(`식약처 API 요청 실패: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    response.json(data);
  } catch (error) {
    response.status(500).json({
      error: "원재료 정보를 불러오지 못했습니다."
    });
  }
});

app.listen(PORT, function () {
  console.log(`서버 실행 주소: http://localhost:${PORT}`);
});
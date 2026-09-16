const ingredientData = {
  "대두": {
    category: "테스트용 식품 원재료",
    source: "테스트 데이터 - 공식 API 연결 전"
  },
  "쌀":{
    category: "테스트용 식품 원재료",
    source: "테스트 데이터 - 공식 API 연결 전"
  }
};

const searchButton = document.querySelector("#search-button");
const ingredientInput = document.querySelector("#ingredient-input");
const resultMessage = document.querySelector("#result-message");

searchButton.addEventListener("click", function () {
  const query = ingredientInput.value.trim();

  if (query === "") {
    resultMessage.textContent = "원재료명을 입력해 주세요.";
    return;
  }

  const result = ingredientData[query];

  if (!result) {
    resultMessage.textContent = `"${query}"에 대한 테스트 데이터를 찾지 못했습니다.`;
    return;
  }

  resultMessage.innerHTML = `
    <strong>${query}</strong><br>
    분류: ${result.category}<br>
    출처: ${result.source}
  `;
});
const searchButton = document.querySelector("#search-button");
const ingredientInput = document.querySelector("#ingredient-input");
const resultMessage = document.querySelector("#result-message");

searchButton.addEventListener("click", function () {
  const query = ingredientInput.value.trim();

  if (query === "") {
    resultMessage.textContent = "원재료명을 입력해 주세요.";
    return;
  }

  resultMessage.textContent = `"${query}"의 검색 결과를 준비 중입니다.`;
});
const searchButton = document.querySelector("#search-button");
const ingredientInput = document.querySelector("#ingredient-input");
const resultMessage = document.querySelector("#result-message");

searchButton.addEventListener("click", async function () {
  const query = ingredientInput.value.trim();

  if (query === "") {
    resultMessage.textContent = "원재료명을 입력해 주세요.";
    return;
  }

  resultMessage.textContent = "공식 데이터를 검색 중입니다.";

  try {
    const serverResponse = await fetch(
      `http://localhost:3000/api/ingredients?q=${encodeURIComponent(query)}`
    );

    const data = await serverResponse.json();

    if (!serverResponse.ok) {
      throw new Error("서버 요청에 실패했습니다.");
    }

    const ingredients = data.body?.items ?? [];

    if (ingredients.length === 0) {
      resultMessage.textContent = `"${query}"에 대한 공식 데이터를 찾지 못했습니다.`;
      return;
    }

    resultMessage.innerHTML = ingredients
      .map(function (ingredient) {
        return `
          <strong>${ingredient.RPRSNT_RAWMTRL_NM ?? "정보 없음"}</strong><br>
          분류: ${ingredient.LCLAS_NM ?? "정보 없음"} / ${ingredient.MLSFC_NM ?? "정보 없음"}<br>
          영문명: ${ingredient.ENG_NM ?? "정보 없음"}<br>
          사용 조건: ${ingredient.USE_CND_NM ?? "정보 없음"}<br>
          출처: 식품의약품안전처 식품 원재료 정보 API
        `;
      })
      .join("<hr>");
  } catch (error) {
    resultMessage.textContent =
      "공식 데이터를 불러오지 못했습니다. 서버 실행 상태를 확인해 주세요.";
  }
});

ingredientInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
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
    const totalCount = data.body?.totalCount ?? ingredients.length;
    const searchedAt = new Date().toLocaleString("ko-KR");
    const sourceUrl = "https://www.data.go.kr/data/15058665/openapi.do";

    if (ingredients.length === 0) {
      resultMessage.textContent = `"${query}"에 대한 공식 데이터를 찾지 못했습니다.`;
      return;
    }

    const cards = ingredients
      .map(function (ingredient) {
        const nickname = ingredient.RAWMTRL_NCKNM ?? "제공되지 않음";
        const usageCondition = ingredient.USE_CND_NM ?? "제공되지 않음";

        return `
          <article class="ingredient-card">
            <h2>${ingredient.RPRSNT_RAWMTRL_NM ?? "정보 없음"}</h2>
            <p><strong>이명:</strong> ${nickname}</p>
            <p><strong>분류:</strong> ${ingredient.LCLAS_NM ?? "정보 없음"} / ${ingredient.MLSFC_NM ?? "정보 없음"}</p>
            <p><strong>영문명:</strong> ${ingredient.ENG_NM ?? "정보 없음"}</p>
            <p><strong>사용 부위:</strong> ${ingredient.REGN_CD_NM ?? "정보 없음"}</p>
            <p><strong>사용 조건:</strong> ${usageCondition}</p>
          </article>
        `;
      })
      .join("");

    resultMessage.innerHTML = `
  <p class="result-summary">"${query}" 검색 결과 총 ${totalCount}건 중 ${ingredients.length}건 표시</p>
  ${cards}
  <p class="source">
    데이터 출처:
    <a href="${sourceUrl}" target="_blank" rel="noreferrer">
      식품의약품안전처 식품 원재료 정보 API
    </a><br>
    조회 시각: ${searchedAt}
  </p>
`;
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
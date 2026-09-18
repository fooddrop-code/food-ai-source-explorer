const searchButton = document.querySelector("#search-button");
const ingredientInput = document.querySelector("#ingredient-input");
const resultMessage = document.querySelector("#result-message");
const previousPageButton = document.querySelector("#previous-page-button");
const nextPageButton = document.querySelector("#next-page-button");

let currentPage = 1;
let currentQuery = "";
const pageSize = 10;

async function searchIngredients() {
  resultMessage.textContent = "공식 데이터를 검색 중입니다.";
  previousPageButton.hidden = true;
  nextPageButton.hidden = true;

  try {
    const serverResponse = await fetch(
      `http://localhost:3000/api/ingredients?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`
    );
    const data = await serverResponse.json();

    if (!serverResponse.ok) {
      throw new Error("서버 요청에 실패했습니다.");
    }

    const ingredients = data.body?.items ?? [];
    const totalCount = data.body?.totalCount ?? ingredients.length;

    if (ingredients.length === 0) {
      resultMessage.textContent = `"${currentQuery}"에 대한 공식 데이터를 찾지 못했습니다.`;
      return;
    }

    const searchedAt = new Date().toLocaleString("ko-KR");
    const sourceUrl = "https://www.data.go.kr/data/15058665/openapi.do";
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
      <p class="result-summary">
        "${currentQuery}" 검색 결과 총 ${totalCount}건 중
        ${currentPage}페이지 ${ingredients.length}건 표시
      </p>
      ${cards}
      <p class="source">
        데이터 출처:
        <a href="${sourceUrl}" target="_blank" rel="noreferrer">
          식품의약품안전처 식품 원재료 정보 API
        </a><br>
        조회 시각: ${searchedAt}
      </p>
    `;

    const lastPage = Math.ceil(totalCount / pageSize);
    previousPageButton.hidden = currentPage === 1;
    nextPageButton.hidden = currentPage >= lastPage;

    if (!nextPageButton.hidden) {
      nextPageButton.textContent = `다음 10건 보기 (${currentPage + 1}페이지)`;
    }
  } catch (error) {
    console.error(error);
    resultMessage.textContent = `오류: ${error.message}`;
  }
}

searchButton.addEventListener("click", function () {
  currentQuery = ingredientInput.value.trim();

  if (currentQuery === "") {
    resultMessage.textContent = "원재료명을 입력해 주세요.";
    return;
  }

  currentPage = 1;
  searchIngredients();
  const items = data.body?.items ?? [];
  const totalCount = data.body?.totalCount ?? 0;
  if (items.length === 0) {
  resultMessage.textContent =
    `"${currentQuery}"에 대한 공식 원재료 정보를 찾지 못했습니다. 검색어를 바꿔 보세요.`;

  resultContainer.innerHTML = `
    <div class="empty-result">
      <strong>검색 결과 없음</strong>
      <p>현재 연결된 식품의약품안전처 식품 원재료 정보 API에서 일치하는 결과를 받지 못했습니다.</p>
    </div>
  `;

  previousPageButton.hidden = true;
  nextPageButton.hidden = true;
  return;
}
});

previousPageButton.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage -= 1;
    searchIngredients();
  }
});

nextPageButton.addEventListener("click", function () {
  currentPage += 1;
  searchIngredients();
});

ingredientInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

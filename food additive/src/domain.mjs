export const REVIEWED_AT = '2026-10-14';
export const SOURCES = {
  mfds: { title: '식품안전나라 · 첨가물의 용도', url: 'https://www.foodsafetykorea.go.kr/portal/board/boardDetail.do?bbs_no=bbs430&menu_grp=MENU_NEW01&menu_no=3725&ntctxt_no=1069700' },
  who: { title: 'WHO · Food additives (2023)', url: 'https://www.who.int/en/news-room/fact-sheets/detail/food-additives' },
  sweeteners: { title: 'FDA · Aspartame and other sweeteners', url: 'https://www.fda.gov/food/food-additives-petitions/aspartame-and-other-sweeteners-food' },
  lecithin: { title: 'EFSA · 레시틴 재평가 (2017, 개정 2021)', url: 'https://efsa.onlinelibrary.wiley.com/doi/abs/10.2903/j.efsa.2017.4742' },
  titanium: { title: 'EFSA · 이산화티타늄 평가 (2021)', url: 'https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive' },
};
const pending = '이 앱에 개별 안전성 평가 요약이 아직 준비되지 않았어요. 첨가물 이름만으로 이 제품의 안전성을 판단할 수 없어요.';
const foodLimit = '첨가물의 함량과 실제 섭취량을 확인하지 않아 이 제품의 개인별 안전성이나 사용기준 준수 여부는 판단하지 않아요.';
function entry(code, name, role, child, aliases, extra = {}) {
  return { code, name, role, child, aliases, status: 'pending', assessment: pending, caveat: foodLimit, sources: [SOURCES.mfds, SOURCES.who], reviewedAt: REVIEWED_AT, ...extra };
}
export const ADDITIVES = [
  entry('e322', '레시틴', '유화제', '물과 기름이 골고루 섞이도록 도와줘요.', ['레시틴', '대두레시틴', '해바라기레시틴', 'lecithin', 'lecithins', 'lécithine', 'lécithines'], {
    status: 'assessed', assessment: 'EFSA의 2017년 평가에서는 보고된 용도와 추정 노출량에서 만 1세 초과 일반 인구에 안전성 우려가 없다고 보았어요. 이 평가의 조건을 모든 제품이나 영아에게 그대로 적용할 수는 없어요.', sources: [SOURCES.mfds, SOURCES.lecithin, SOURCES.who],
  }),
  entry('e330', '구연산', '산도조절제', '음식의 산도를 조절하는 역할을 해요.', ['구연산', 'citric acid', 'acide citrique']),
  entry('e440', '펙틴', '증점제', '음식의 점도를 높여줘요.', ['펙틴', 'pectin', 'pectine']),
  entry('e500ii', '탄산수소나트륨', '팽창제', '반죽이 부풀어 오르도록 도와줘요.', ['탄산수소나트륨', '탄산수소 나트륨', '중탄산나트륨', 'sodium bicarbonate', 'sodium hydrogen carbonate', 'bicarbonate de sodium']),
  entry('e621', 'L-글루탐산나트륨', '향미증진제', '음식의 맛을 더해주는 역할을 해요.', ['l-글루탐산나트륨', 'l-글루타민산나트륨', '글루탐산나트륨', '글루타민산나트륨', 'monosodium glutamate']),
  entry('e200', '소브산', '보존료', '미생물 때문에 음식의 품질이 떨어지는 것을 늦춰줘요.', ['소브산', '소르빈산', 'sorbic acid']),
  entry('e210', '안식향산', '보존료', '미생물 때문에 음식의 품질이 떨어지는 것을 늦춰줘요.', ['안식향산', '벤조산', 'benzoic acid']),
  entry('e551', '이산화규소', '고결방지제', '가루끼리 뭉치는 것을 줄여줘요.', ['이산화규소', 'silicon dioxide']),
  entry('e950', '아세설팜칼륨', '감미료', '음식에 단맛을 더해줘요.', ['아세설팜칼륨', '아세설팜 칼륨', 'acesulfame potassium', 'acesulfame k', 'acésulfame k'], {
    status: 'assessed', assessment: 'FDA는 승인된 감미료를 정해진 사용 조건에서 일반 인구에 안전하다고 설명해요. 미국의 설명이며 국내 개별 제품의 기준 준수를 확인한 것은 아니에요.', sources: [SOURCES.mfds, SOURCES.sweeteners, SOURCES.who],
  }),
  entry('e951', '아스파탐', '감미료', '음식에 단맛을 더해줘요. 특정 질환이 있으면 보호자와 따로 확인해야 해요.', ['아스파탐', 'aspartame'], {
    status: 'condition', assessment: 'FDA는 승인된 사용 조건에서 일반 인구에 안전하다고 설명해요. 페닐케톤뇨증(PKU)이 있는 사람은 피하거나 섭취를 제한해야 한다고 안내해요.', caveat: 'PKU 관련 주의가 있어요. 미국 FDA 평가를 안내하며, 개인의 섭취 가능 여부와 국내 제품의 기준 준수는 확인하지 않았어요.', sources: [SOURCES.sweeteners, SOURCES.who],
  }),
  entry('e955', '수크랄로스', '감미료', '음식에 단맛을 더해줘요.', ['수크랄로스', 'sucralose'], {
    status: 'assessed', assessment: 'FDA는 승인된 감미료를 정해진 사용 조건에서 일반 인구에 안전하다고 설명해요. 미국의 설명이며 국내 개별 제품의 기준 준수를 확인한 것은 아니에요.', sources: [SOURCES.sweeteners, SOURCES.who],
  }),
  entry('e171', '이산화티타늄', '착색료', '음식에 색을 더하는 역할을 해요. 평가 자료를 보호자와 확인해요.', ['이산화티타늄', 'titanium dioxide', 'dioxyde de titane'], {
    status: 'attention', assessment: 'EFSA는 2021년 유전독성 우려를 배제할 수 없어 식품첨가물로서 더 이상 안전하다고 볼 수 없다고 평가했어요. 유럽의 평가이며, 국내 허용 여부는 이 앱에서 확인하지 않았어요.', sources: [SOURCES.titanium, SOURCES.who],
  }),
];
export const STATUS = {
  assessed: { label: '평가 자료 있음', color: '#306754', background: '#E8F3EC' },
  condition: { label: '특정 조건 주의', color: '#86530B', background: '#FFF1D6' },
  attention: { label: '평가 주의사항', color: '#A73849', background: '#FCE8EC' },
  pending: { label: '해설 준비중', color: '#66626C', background: '#F0EDF3' },
};
const normalize = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
export function additiveCode(value) {
  return normalize(value).replace(/^en:/, '').replace(/\s+/g, '');
}
export function findAdditive(code) {
  const clean = additiveCode(code);
  return ADDITIVES.find((a) => a.code === clean || (a.code === 'e322' && /^e322i{1,2}$/.test(clean)) || (a.code === 'e440' && /^e440i{1,2}$/.test(clean)));
}
function containsAlias(text, alias) {
  const escaped = normalize(alias).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}-])${escaped}(?=$|[^\\p{L}\\p{N}-])`, 'u').test(text);
}
export function analyzeIngredients(ingredients = '', tags = []) {
  const text = normalize(ingredients);
  const entries = new Map();
  const unknown = new Set();
  for (const tag of tags) {
    const code = additiveCode(tag);
    if (!/^e\d{3,4}[a-z]*$/.test(code)) continue;
    const a = findAdditive(code);
    if (a) entries.set(a.code, { ...a, match: '공개 데이터의 첨가물 분류' });
    else unknown.add(code.toUpperCase());
  }
  for (const a of ADDITIVES) {
    const codeMatches = [...text.matchAll(/(?:^|[^\p{L}\p{N}])e\s*(\d{3,4})([a-z]*)(?=$|[^\p{L}\p{N}])/gu)].some((m) => findAdditive(`e${m[1]}${m[2]}`)?.code === a.code);
    if (codeMatches || a.aliases.some((alias) => containsAlias(text, alias))) entries.set(a.code, { ...a, match: '원재료명에서 이름 확인' });
  }
  // Recognise explicit unknown E numbers; do not claim that unmatched words are additives.
  for (const m of text.matchAll(/(?:^|[^\p{L}\p{N}])e\s*(\d{3,4})([a-z]*)(?=$|[^\p{L}\p{N}])/gu)) {
    if (!findAdditive(`e${m[1]}${m[2]}`)) unknown.add(`E${m[1]}${m[2].toUpperCase()}`);
  }
  return { entries: [...entries.values()], unknown: [...unknown], hasIngredients: !!text, notExhaustive: true };
}
export function safeProductImage(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'images.openfoodfacts.org' ? u.href : undefined; } catch { return undefined; }
}
export function offProduct(raw) {
  const code = String(raw.code ?? '');
  if (!/^\d{8,14}$/.test(code)) return null;
  const n = raw.product_name;
  const name = raw.product_name_ko || (typeof n === 'string' ? n : n?.ko || n?.en) || raw.product_name_en || '제품명 정보 없음';
  return {
    id: `off:${code}`, name, brand: Array.isArray(raw.brands) ? raw.brands.join(', ') : raw.brands || '제조사 정보 없음', quantity: raw.quantity || '',
    countries: raw.countries_tags || [], imageUrl: safeProductImage(raw.image_front_small_url || raw.image_front_url),
    ingredients: raw.ingredients_text_ko || raw.ingredients_text || raw.ingredients_text_en || '', additiveTags: raw.additives_tags || [],
    source: 'Open Food Facts', sourceUrl: `https://world.openfoodfacts.org/product/${code}`, ingredientsComplete: false,
    updatedAt: raw.last_modified_t ? new Date(Number(raw.last_modified_t) * 1000).toISOString().slice(0, 10) : '',
  };
}
export const SEARCH_ALIASES = { '오레오': 'oreo', '누텔라': 'nutella', '코카콜라': 'coca cola', '코카 콜라': 'coca cola', '프링글스': 'pringles', '킷캣': 'kitkat' };
export function offQuery(query) {
  const translated = SEARCH_ALIASES[normalize(query)] || query;
  const escaped = translated.replace(/[+\-&|!(){}\[\]^"~*?:\\/]/g, ' ').trim();
  return `countries_tags:"en:south-korea" ${escaped}`;
}
export function mfdsProduct(raw, detailed = false) {
  const code = String(raw.PRDLST_REPORT_NO || '');
  if (!/^\d+$/.test(code)) return null;
  return { id: `mfds:${code}`, name: raw.PRDLST_NM || '제품명 정보 없음', brand: raw.BSSH_NM || '제조사 정보 없음', quantity: '', countries: ['en:south-korea'], ingredients: detailed ? raw.RAWMTRL_NM || '' : '', additiveTags: [], source: '식품안전나라', sourceUrl: 'https://www.foodsafetykorea.go.kr/api/openApiInfo.do?svc_no=C002', ingredientsComplete: detailed, updatedAt: raw.CHNG_DT ? String(raw.CHNG_DT).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '' };
}

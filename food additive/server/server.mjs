import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { offProduct, offQuery, mfdsProduct } from '../src/domain.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = process.env.MFDS_API_KEY;
const port = Number(process.env.PORT || 8787);
const cache = new Map();
const inFlight = new Map();
let lastOffSearch = 0;
async function fetchJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'MoguFoodExplorer/0.1 (development prototype)', Accept: 'application/json' }, signal: AbortSignal.timeout(16000) });
  if (!r.ok) throw new Error('데이터 서비스에 연결하지 못했어요. 잠시 후 다시 시도해주세요.');
  return r.json();
}
async function cached(id, fn) {
  const record = cache.get(id);
  if (record && record.expires > Date.now()) return record.data;
  if (inFlight.has(id)) return inFlight.get(id);
  const request = fn().then(data => { if (cache.size >= 200) cache.delete(cache.keys().next().value); cache.set(id, { data, expires: Date.now() + 300000 }); return data; }).finally(() => inFlight.delete(id));
  inFlight.set(id, request); return request;
}
async function mfds(service, filter, limit = 20) {
  if (!key) throw new Error('국내 제품 데이터 연결이 준비되지 않았어요.');
  // HTTPS is supported by the current endpoint; never expose the key to the app.
  const url = `https://openapi.foodsafetykorea.go.kr/api/${encodeURIComponent(key)}/${service}/json/1/${limit}/${filter}`;
  const data = (await fetchJson(url))[service];
  if (!data) throw new Error('국내 제품 데이터의 응답을 확인하지 못했어요.');
  const code = data.RESULT?.CODE;
  if (code === 'INFO-200') return { row: [], total_count: '0' };
  if (code && code !== 'INFO-000') throw new Error('국내 제품 데이터 연결 설정 또는 이용 한도를 확인해주세요.');
  return data;
}
async function search(query) {
  return cached(`search:${query}`, async () => {
    const products = [], notices = [];
    let providers = [];
    let success = false;
    if (key) {
      try {
        const data = await mfds('I1250', `PRDLST_NM=${encodeURIComponent(query)}`);
        products.push(...(data.row || []).map(r => mfdsProduct(r)).filter(Boolean)); providers.push('식품안전나라'); success = true;
      } catch (e) { notices.push(e.message); }
    } else notices.push('국내 공식 데이터는 연결 준비중이에요. 지금은 한국 판매로 등록된 공개 제품 데이터를 검색해요.');
    try {
      if (Date.now() - lastOffSearch < 6500) {
        if (!success) throw new Error('검색 사이에 잠시 기다려주세요.');
        notices.push('공개 제품 검색은 잠시 후 다시 이용할 수 있어요.');
      } else {
        lastOffSearch = Date.now();
        const url = new URL('https://search.openfoodfacts.org/search'); url.searchParams.set('q', offQuery(query)); url.searchParams.set('page_size', '12');
        const data = await fetchJson(url.href);
        if (!Array.isArray(data.hits)) throw new Error('공개 제품 데이터 응답을 확인하지 못했어요.');
        products.push(...data.hits.map(offProduct).filter(p => p && p.countries.includes('en:south-korea'))); providers.push('Open Food Facts'); success = true;
      }
    } catch(e) { notices.push(e.message); }
    if (!success) throw new Error(notices.join(' '));
    notices.push('제품명·제조사·용량을 포장지와 비교해주세요. 등록 시점의 정보이며 모든 국내 제품이 포함되지는 않아요.');
    return { products, notices, provider: providers.join(' + ') };
  });
}
async function detail(id) {
  return cached(`detail:${id}`, async () => {
    const [provider, code] = id.split(':');
    if (!/^(off|mfds):\d{8,24}$/.test(id)) throw new Error('제품 번호를 확인해주세요.');
    if (provider === 'mfds') {
      const data = await mfds('C002', `PRDLST_REPORT_NO=${code}`, 1000);
      if (!data.row?.length) throw new Error('이 제품의 원재료 정보를 찾지 못했어요.');
      const row = data.row[0];
      const product = mfdsProduct({ ...row, RAWMTRL_NM: data.row.map(r => r.RAWMTRL_NM).filter(Boolean).join(', ') }, true);
      product.ingredientsComplete = Number(data.total_count) <= data.row.length;
      return { product };
    }
    const fields = 'code,product_name,product_name_ko,product_name_en,brands,quantity,countries_tags,image_front_small_url,ingredients_text,ingredients_text_ko,ingredients_text_en,additives_tags,last_modified_t';
    const data = await fetchJson(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`);
    if (data.status !== 1 || !data.product) throw new Error('제품 상세 정보를 찾지 못했어요.');
    const product = offProduct(data.product);
    if (!product) throw new Error('제품 데이터 형식을 확인하지 못했어요.');
    return { product };
  });
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      let data;
      if (url.pathname === '/api/health') data = { status: 'ok', domesticConfigured: !!key, reviewedAt: '2026-10-14' };
      else if (url.pathname === '/api/search') {
        const query = (url.searchParams.get('q') || '').trim();
        if (query.length < 2 || query.length > 80 || /[\r\n]/.test(query)) { res.writeHead(400); res.end(JSON.stringify({ error: '제품명을 2~80자로 입력해주세요.' })); return; }
        data = await search(query);
      } else if (url.pathname === '/api/product') data = await detail(url.searchParams.get('id') || '');
      else { res.writeHead(404); res.end('{}'); return; }
      res.end(JSON.stringify(data));
    } catch (e) { res.writeHead(502); res.end(JSON.stringify({ error: e.message || '제품 데이터 연결을 확인해주세요.' })); }
    return;
  }
  const dist = resolve(root, 'dist');
  try {
    let file = resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (file !== dist && !file.startsWith(dist + sep)) { res.writeHead(403); res.end(); return; }
    if (file === dist || !extname(file)) file = resolve(dist, 'index.html');
    const body = await readFile(file); res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream'); res.end(body);
  } catch { res.writeHead(404); res.end('Preview is not built. Run npm run build:web.'); }
});
server.listen(port, '0.0.0.0', () => console.log(`Mogu: http://localhost:${port} · domestic data ${key ? 'configured' : 'not configured'}`));

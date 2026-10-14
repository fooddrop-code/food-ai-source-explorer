import { offProduct, offQuery } from './domain.mjs';
import { Platform } from 'react-native';

export type Product = {
  id: string; name: string; brand: string; quantity: string; countries: string[];
  imageUrl?: string; ingredients: string; additiveTags: string[]; source: string; sourceUrl: string;
  updatedAt: string; ingredientsComplete: boolean;
};
export type SearchResult = { products: Product[]; notices: string[]; provider: string };
const endpoint = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || (Platform.OS === 'web' && typeof location !== 'undefined' && location.port === '8787' ? location.origin : '');
async function getJson(url: string, signal?: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 18000);
  try {
    const r = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(r.status === 429 ? '잠시 기다린 뒤 다시 검색해주세요.' : '제품 데이터 서비스에 연결하지 못했어요. 잠시 후 다시 시도해주세요.');
    return await r.json();
  } catch (e) {
    if (controller.signal.aborted && !signal?.aborted) throw new Error('연결 시간이 오래 걸리고 있어요. 잠시 후 다시 시도해주세요.');
    throw e;
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
export async function searchProducts(query: string, signal?: AbortSignal): Promise<SearchResult> {
  if (query.trim().length < 2 || query.trim().length > 80) throw new Error('제품명을 2~80자로 입력해주세요.');
  if (endpoint) {
    const data = await getJson(`${endpoint}/api/search?q=${encodeURIComponent(query.trim())}`, signal);
    if (data.error) throw new Error(data.error);
    return data;
  }
  const url = new URL('https://search.openfoodfacts.org/search');
  url.searchParams.set('q', offQuery(query.trim())); url.searchParams.set('page_size', '12');
  const data = await getJson(url.href, signal);
  if (!Array.isArray(data.hits)) throw new Error('제품 데이터 형식을 확인하지 못했어요.');
  return { products: data.hits.map(offProduct).filter((p: Product | null) => p && p.countries.includes('en:south-korea')), provider: 'Open Food Facts', notices: ['한국 판매로 등록된 공개 데이터만 검색해요. 국내 모든 제품이 포함되지는 않아요.', '포장지와 제품명·제조사·용량을 비교해주세요. 판매 국가와 원재료 정보는 등록 시점의 정보예요.'] };
}
export async function productDetails(product: Product, signal?: AbortSignal): Promise<Product> {
  if (endpoint) {
    const data = await getJson(`${endpoint}/api/product?id=${encodeURIComponent(product.id)}`, signal);
    if (data.error) throw new Error(data.error);
    return data.product;
  }
  if (!product.id.startsWith('off:')) throw new Error('이 제품은 국내 데이터 서버 연결이 필요해요.');
  const fields = 'code,product_name,product_name_ko,product_name_en,brands,quantity,countries_tags,image_front_small_url,ingredients_text,ingredients_text_ko,ingredients_text_en,additives_tags,last_modified_t';
  const data = await getJson(`https://world.openfoodfacts.org/api/v2/product/${product.id.slice(4)}.json?fields=${fields}`, signal);
  if (data.status !== 1 || !data.product) throw new Error('이 제품의 상세 정보를 찾지 못했어요.');
  const result = offProduct(data.product);
  if (!result) throw new Error('제품 정보를 확인하지 못했어요.');
  return result;
}

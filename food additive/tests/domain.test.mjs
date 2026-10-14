import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIngredients, findAdditive, offProduct, offQuery, safeProductImage, mfdsProduct } from '../src/domain.mjs';

test('Korean names and international codes identify the same ingredient once', () => {
 const a = analyzeIngredients('설탕, 대두레시틴, 레시틴, 구연산, E322, E 330', ['en:e322', 'en:e322i']);
 assert.deepEqual(a.entries.map(x=>x.code).sort(), ['e322','e330']);
 assert.equal(a.notExhaustive, true);
});
test('missing ingredients never mean additive-free or safe', () => {
 const a = analyzeIngredients(''); assert.equal(a.hasIngredients, false); assert.equal(a.entries.length, 0); assert.equal(a.notExhaustive, true);
});
test('unknown code is preserved, and compounds are not conflated', () => {
 const a = analyzeIngredients('소브산칼륨, 안식향산나트륨, E202, E211', ['en:e202']);
 assert.equal(a.entries.length, 0); assert.deepEqual(a.unknown.sort(), ['E202','E211']);
});
test('E number variants are not mistaken for parent chemical', () => {
 assert.equal(findAdditive('en:e500'), undefined); assert.equal(findAdditive('en:e500ii')?.name, '탄산수소나트륨');
 assert.equal(findAdditive('en:e322i')?.code,'e322');
});
test('known medical condition is retained with its source and caveat', () => {
 const a = analyzeIngredients('aspartame').entries[0]; assert.equal(a.status,'condition'); assert.match(a.assessment,/PKU/); assert.match(a.sources[0].url,/fda\.gov/);
});
test('compound names do not spuriously match short substrings', () => {
 assert.equal(analyzeIngredients('sucralose-likecompound, lecithinase').entries.length, 0);
});
test('name search always retains Korean sale filter and escapes search syntax', () => {
 assert.equal(offQuery('오레오'), 'countries_tags:"en:south-korea" oreo');
 assert.equal(offQuery('foo countries_tags:"en:france"').includes('countries_tags:"en:france"'), false);
});
test('product parser supports source name structure and rejects invalid identifiers', () => {
 assert.equal(offProduct({code:'bad',product_name:'x'}),null);
 const p=offProduct({code:'8801037091113',product_name:{ko:'제품명',en:'Product'},brands:['A','B'],additives_tags:[],countries_tags:['en:south-korea']});
 assert.equal(p.name,'제품명'); assert.equal(p.brand,'A, B'); assert.equal(p.ingredients,'');
});
test('remote image URLs are limited to the source image host', () => {
 assert.equal(safeProductImage('https://images.openfoodfacts.org/path.png'), 'https://images.openfoodfacts.org/path.png');
 assert.equal(safeProductImage('http://images.openfoodfacts.org/path.png'), undefined); assert.equal(safeProductImage('https://evil.example/path.png'), undefined);
});
test('domestic detail preserves source and report number', () => {
 const p=mfdsProduct({PRDLST_REPORT_NO:'1997040105528',PRDLST_NM:'가시오가피 냉면',BSSH_NM:'주식회사 금성에프앤비',RAWMTRL_NM:'밀가루, 정제수',CHNG_DT:'20230610'},true);
 assert.equal(p.id,'mfds:1997040105528'); assert.equal(p.ingredients,'밀가루, 정제수'); assert.equal(p.updatedAt,'2023-06-10');
});

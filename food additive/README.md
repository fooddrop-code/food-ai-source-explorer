# 모구 · 성분 탐정

여성, 부모, 아이를 위한 **제품명 검색형 식품첨가물 안내 앱**의 개발 버전입니다. 아이폰과 안드로이드 공통 코드로 작성했으며, 같은 화면을 브라우저에서도 미리 볼 수 있습니다.

앱 이름과 분홍 토끼 캐릭터 ‘모구’는 임시 제안입니다.

![개발 버전 미리보기](assets/app-preview.jpg)

## 먼저 수정할 문서

- [앱 기획서](APP_PLAN.md): 타깃, 화면, 기능, 캐릭터, 추가 기능, 결정할 사항
- [데이터 출처와 설명 기준](DATA_SOURCES.md): 제품 데이터 연결 방식과 성분 설명의 근거
- 이 README: 실행 방법, 설치 빌드, 검증 결과

GitHub에서 문서를 열고 연필 아이콘으로 수정할 수 있습니다. **Markdown 수정만으로 앱 화면이 자동 변경되지는 않습니다.** 실제 문구·색상·기능은 아래 코드 위치도 수정하세요.

## 현재 기능

- 제품명을 입력해 한국 판매로 등록된 공개 제품 검색
- 제품 선택 후 원재료 원문·첨가물 분류 조회
- 캐릭터와 12개 성분 도감, 출처가 있는 평가 설명
- 함께 보기 / 아이 보기
- 원재료명 직접 입력과 기기 내 분석
- 제품 보관함 저장·삭제
- 검색 실패·원재료 누락·설명 준비중 표시
- 식품안전나라 API 서버 연결 코드

제품 데이터가 없으면 성분을 추측하지 않습니다. 모든 첨가물을 탐지하거나 제품 전체의 안전성을 인증하는 기능은 아닙니다.

## 실행

Node.js 22 이상과 npm을 사용하세요. 개발 시 확인한 환경은 Node.js 24.21.0, Expo 57, React Native 0.86입니다.

```sh
npm ci
npm run build:web
npm run preview
```

브라우저에서 `http://localhost:8787`을 엽니다. API 서버와 정적 미리보기를 같은 포트에서 실행합니다. 인터넷 연결이 있어야 공개 제품 검색과 상세 조회가 가능합니다.

캐릭터 PNG 아이콘을 다시 만들려면:

```sh
node scripts/create-icons.mjs
```

## 휴대폰에서 개발 버전 실행

```sh
npm start
```

Expo가 표시하는 안내를 따라 휴대폰에서 여세요. Expo Go를 사용할 경우 설치된 Expo Go와 프로젝트 SDK의 호환성을 확인하세요. 버전이 맞지 않으면 개발 빌드가 필요합니다. 자세한 방법은 [Expo 공식 시작 안내](https://docs.expo.dev/get-started/start-developing/)를 참고하세요.

API 서버 주소를 설정하지 않으면 휴대폰 앱은 Open Food Facts에 한국 판매로 등록된 제품을 직접 검색합니다. 국내 공식 데이터를 연결하려면 다음 서버 설정을 사용하세요.

## 국내 공식 데이터 연결

1. 식품안전나라에서 인증키와 필요한 서비스 이용 권한을 확인합니다.
2. `.env.example`을 복사해 로컬 `.env` 파일을 만듭니다.
3. `MFDS_API_KEY`에 발급된 키를 넣습니다.
4. 휴대폰에서 접근 가능한 서버 주소를 `EXPO_PUBLIC_API_URL`에 넣습니다.
5. 서버와 Expo 개발 서버를 다시 실행합니다.

```dotenv
MFDS_API_KEY=발급받은_키
EXPO_PUBLIC_API_URL=http://컴퓨터의_내부망_IP:8787
PORT=8787
```

휴대폰의 `localhost`는 휴대폰 자체를 가리킵니다. 로컬 개발에서는 컴퓨터와 휴대폰이 같은 네트워크에 있어야 합니다. 실제 배포 시에는 HTTPS 서버를 사용하세요.

**키는 서버에만 둡니다.** `EXPO_PUBLIC_MFDS_API_KEY`처럼 앱에 노출되는 이름을 쓰지 마세요. `.env`는 Git에서 제외되며 `.env.example`만 올립니다.

공식 인증키를 사용한 I1250·C002 실조회는 아직 미검증입니다. 최근 서비스 이용 변경 공지가 있어 발급된 키의 권한과 제한을 확인해야 합니다.

## 설치 파일 만들기

현재 결과물은 앱 소스·개발 미리보기·플랫폼별 코드 번들입니다. **APK, AAB, IPA 설치 파일은 아직 없습니다.**

`eas.json`에 Android 내부 테스트용 APK와 iOS 기기 테스트용 빌드 프로필을 준비했습니다. 계정 로그인·앱 식별자·서명 설정을 완료한 뒤 실행합니다.

```sh
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform ios --profile preview
```

`com.mogu.foodexplorer`는 임시 앱 식별자입니다. 배포 전에 본인 프로젝트에 맞게 `app.json`에서 변경하세요. iOS 실기기 배포에는 Apple의 계정·서명 요건을 충족해야 합니다. 확인할 공식 문서: [첫 EAS 빌드](https://docs.expo.dev/build/setup/), [내부 배포](https://docs.expo.dev/build/internal-distribution/).

클라우드 계정 연결, 소스 업로드, 서명된 앱 생성, 스토어 등록은 아직 진행하지 않았습니다. 무료·유료 빌드 가능 여부와 계정 요건은 해당 서비스에서 확인하세요.

## 수정 위치

| 바꾸려는 것 | 파일 |
| --- | --- |
| 홈 문구, 화면 구성, 버튼, 색상 | `App.tsx` |
| 캐릭터와 아이콘의 벡터 형태 | `src/Illustrations.tsx` |
| 성분명, 쉬운 설명, 평가 내용, 출처, 검토일 | `src/domain.mjs` |
| 검색어 대응어, 원재료 이름 탐지 | `src/domain.mjs` |
| 앱의 제품 조회 | `src/api.ts` |
| 국내 API, 공개 데이터 조회, 캐시 | `server/server.mjs` |
| 앱 이름, 패키지명, 아이콘 설정 | `app.json` |
| 설치 빌드 설정 | `eas.json` |

## 검증

```sh
npm run typecheck
npm test
npm run build:web
npm run bundle:native
```

검증 기록은 [CHECKS.md](CHECKS.md)에 정리했습니다. 실제 아이폰·안드로이드에서 설치·동작한 것으로 간주하지 않습니다.

## GitHub에 올리기

이 `mogu` 폴더를 저장소의 루트로 사용하세요. 소스 파일, 문서, `package.json`, `package-lock.json`, 자산 파일을 함께 올립니다. `node_modules`, `.env`, 생성된 번들과 설치 파일은 제외합니다.

빈 GitHub 저장소를 만든 뒤, 이 폴더에서 다음을 실행할 수 있습니다. URL은 본인의 저장소 주소로 바꾸세요.

```sh
git init
git add .
git commit -m "Add Mogu food additive app prototype"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

이 앱은 fooddrop-code/food-ai-source-explorer 저장소의 food additive 폴더에서 관리합니다. GitHub에서 Markdown 문서를 수정하거나, 이 폴더의 앱 코드를 수정하고 커밋해 변경을 반영하세요.

## 알려진 제한

- 공개 검색은 국내 전체 제품을 포함하지 않습니다. 포장지와 정보를 비교해야 합니다.
- 도감은 12개 성분으로 제한됩니다. 개별 평가 설명은 일부 성분에만 준비되어 있습니다.
- 성분의 함량과 섭취량을 확인하지 않으며, 알레르기·질환별 개인 판단을 제공하지 않습니다.
- 사진 OCR, 바코드 촬영, 로그인, 클라우드 보관함은 구현하지 않았습니다.
- 서버는 개발용입니다. 실제 서비스에는 배포 환경에 맞는 접근 제어·호출 한도·운영 점검이 필요합니다.
- Expo 개발 도구의 간접 의존성에서 npm 보안 감사 경고가 남아 있습니다. 호환 범위의 수정은 적용했으며, 강제 하위 SDK 변경은 하지 않았습니다. 출시 전 상위 패키지의 수정과 영향을 다시 확인하세요.

## 데이터 및 개인정보

제품 정보는 식품안전나라 또는 Open Food Facts에서 가져옵니다. 성분 설명의 근거는 [DATA_SOURCES.md](DATA_SOURCES.md)를 참고하세요. 공개 데이터의 이용 조건은 코드 라이선스와 별도로 확인해야 합니다.

검색어와 제품 번호는 데이터 조회 서버에 전달됩니다. 직접 입력한 원재료는 기기에서 분석하고, 보관함도 기기에 저장합니다. 계정·광고·행동 분석 기능은 사용하지 않습니다. 실제 출시 전에 운영 환경과 기능에 맞는 개인정보 문서를 작성하세요.

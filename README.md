# 팬덤&

Expo SDK 56 기반의 온라인 팬 커머스 목업 앱입니다. 상품 피드, 검색, 상세, 장바구니, 체크아웃, 토스페이먼츠 테스트 결제 redirect, 주문/배송 상태 흐름을 FSD 구조로 구성합니다.

## Stack

- Expo SDK 56
- Expo Router
- React Native 0.85
- React 19
- TypeScript
- shadcn-style React Native primitives under `src/shared/ui`

## Run

```bash
bun install
bun expo start
```

Web smoke test:

```bash
bun expo start --web
```

## Environment

토스페이먼츠 결제창 테스트를 실행하려면 공개 테스트 클라이언트 키만 설정합니다. Secret key는 클라이언트 앱에 넣지 않습니다.

```bash
EXPO_PUBLIC_TOSS_CLIENT_KEY=your_test_client_key
```

키가 없으면 체크아웃 화면에서 결제 버튼을 눌렀을 때 키 필요 상태가 표시됩니다.

## Verification

```bash
bun expo lint
bunx tsc --noEmit
```

Manual flow:

1. 홈에서 상품 선택
2. 상세에서 장바구니 담기 또는 바로 구매
3. 장바구니에서 수량 변경, 삭제, 구매하기
4. 주문서에서 결제하기
5. 토스 redirect 성공/실패 route 확인
6. 주문 탭에서 배송 중, 배송 완료, 완료된 물품 확인

## Architecture

```txt
src/
  app/       expo-router routes only
  pages/     route-level page composition
  widgets/   larger reusable screen blocks
  features/  user actions and flows
  entities/  commerce domain models
  shared/    UI primitives, config, utilities
```

# 팬덤&

Expo SDK 56 기반의 온라인 팬 커머스 목업 앱입니다. 상품 피드, 검색, 상세, 장바구니, 주문서, 앱 내부 목업 결제창, 주문/배송 상태 흐름을 FSD 구조로 구성합니다.

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

Android dev client:

```bash
bun expo run:android
bun expo start --dev-client
```

Web smoke test:

```bash
bun expo start --web
```

## Environment

현재 결제는 외부 PG 연동 없이 앱 내부 목업 결제창으로 동작합니다. 별도 `.env` 값이나 테스트 키가 필요하지 않습니다.

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
5. 목업 결제창에서 결제 완료 또는 닫기
6. 주문 탭에서 배송 상태와 완료된 주문 확인

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

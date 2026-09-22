# DoubleCode

바코드와 QR코드를 한 화면에서 만들고 저장하는 작은 코드 제작 도구입니다.

https://doublecode.net

[English](#english)

---

## 왜 만들었나요

바코드와 QR코드는 자주 같이 필요합니다.  
제품 번호는 바코드로, 같은 값이나 안내 링크는 QR코드로 만들어야 하는 일이 생각보다 많습니다.

그런데 대부분의 도구는 둘 중 하나만 만들거나, 설정 화면이 따로 떨어져 있거나, 값을 조금씩 바꿔가며 반복 작업하기가 번거로웠습니다.

DoubleCode는 그 과정을 한 화면에 모았습니다.  
한 번 입력하면 바코드와 QR코드가 같이 바뀌고, 필요한 쪽을 바로 PNG나 SVG로 저장할 수 있습니다.

## 이런 상황에 맞습니다

- 상품 코드, 관리 번호, 재고 번호를 빠르게 이미지로 만들 때
- 같은 값을 바코드와 QR코드 두 형식으로 같이 준비해야 할 때
- 앞뒤 고정 문구를 두고 가운데 값만 계속 바꿔야 할 때
- 문서, 라벨, 패키지, 안내문에 들어갈 코드를 바로 뽑아야 할 때
- 로그인이나 대시보드 없이 가볍게 코드 이미지만 만들고 싶을 때

## DoubleCode에서 신경 쓴 부분

### 한 번 입력하고 두 가지로 보기

중앙 입력값을 바꾸면 바코드와 QR코드 미리보기가 함께 갱신됩니다.  
두 도구를 오가며 같은 값을 다시 붙여넣을 필요가 없습니다.

### 왼쪽 / 중앙 / 오른쪽 입력

반복 작업을 하다 보면 전체 문자열보다 일부 값만 자주 바뀌는 경우가 많습니다.

예를 들어 아래처럼 나눠두면:

```text
ABC-   123456   -KR
```

최종 코드는 이렇게 만들어집니다.

```text
ABC-123456-KR
```

앞뒤 값은 그대로 두고 가운데 값만 바꿔가며 코드를 만들 수 있습니다.

### 필요한 만큼만 꾸미기

바코드는 형식, 높이, 선 간격, 색상, 여백, 글자 표시를 조정할 수 있습니다.  
QR코드는 크기, 여백, 오류정정 수준, 점 모양, 색상, 배경, 중앙 이미지를 조정할 수 있습니다.

## 지원하는 것

- 바코드와 QR코드 동시 미리보기
- CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar 등
- PNG / SVG 저장
- 투명 배경
- QR 중앙 이미지
- 한국어 / 영어 UI
- 라이트 / 다크 모드
- 피드백 댓글
- 화면 위에서 따라가는 사용법 안내

개발 환경과 프로젝트 구조는 [DEVELOPMENT.md](./DEVELOPMENT.md)에 따로 정리했습니다.

---

## English

DoubleCode is a small workspace for creating barcodes and QR codes side by side.

https://doublecode.net

## Why

Barcodes and QR codes often travel together.  
A product number may need a barcode, while the same value or a related link needs a QR code.

DoubleCode keeps that workflow in one place. Type once, preview both formats, adjust the details, and export PNG or SVG.

## Good for

- Product codes, inventory numbers, and internal labels
- Preparing a barcode and QR code from the same value
- Repeating work where only the middle part of a value changes
- Codes for documents, labels, packaging, and printed guides
- Quick image export without signing in to a dashboard

## What it does

- Live barcode and QR previews
- Split input: left / center / right joined as one value
- CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar, and more
- PNG / SVG export
- Transparent backgrounds
- QR center image
- Korean / English UI
- Light / dark mode
- Feedback comments
- An on-screen usage guide

Development setup and project structure live in [DEVELOPMENT.md](./DEVELOPMENT.md).

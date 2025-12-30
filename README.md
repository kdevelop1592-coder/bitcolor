# 비트와 색상 학습 (Bit Color Practice)

비트 표현과 색상 매핑을 학습하고 연습할 수 있는 인터랙티브 웹사이트입니다.

## 🎨 기능

### 참조 테이블
- **00** → 검정 (Black)
- **01** → 파랑 (Blue)
- **10** → 노랑 (Yellow)
- **11** → 회색 (Gray)

### 그리기 모드
- 16x16 그리드에서 자유롭게 그림을 그릴 수 있습니다
- 4가지 색상(비트 값)을 선택하여 사용
- 비트 값 표시/숨기기 기능
- 캔버스 초기화 기능

### 퀴즈 모드
- 색상 → 비트 변환 문제
- 비트 → 색상 변환 문제
- 실시간 정답/오답 통계
- 정확도 계산

## 🚀 GitHub Pages 배포 방법

### 1. GitHub 저장소 생성
```bash
cd d:/project/bircolor
git init
git add .
git commit -m "Initial commit: Bit Color Practice website"
```

### 2. GitHub에 푸시
```bash
# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/bircolor.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages 활성화
1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source**에서 **main** 브랜치 선택
5. **Save** 클릭

### 4. 웹사이트 접속
- 몇 분 후 `https://YOUR_USERNAME.github.io/bircolor/`에서 접속 가능

## 💻 로컬 실행

1. 파일 다운로드
2. `index.html` 파일을 브라우저로 열기

또는 로컬 서버 실행:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server
```

## 🛠️ 기술 스택

- **HTML5**: 구조
- **CSS3**: 스타일링 (다크 테마, 그라디언트, 애니메이션)
- **Vanilla JavaScript**: 인터랙티브 기능
- **Google Fonts**: Noto Sans KR, JetBrains Mono

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 경험을 제공합니다.

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Made with ❤️ for learning

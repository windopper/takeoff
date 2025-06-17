// Reddit RSS 구조를 확인하는 디버깅 스크립트

async function debugRedditRSS() {
  const url = 'https://www.reddit.com/r/singularity/.rss?sort=hot';
  
  try {
    console.log('Reddit RSS 피드를 가져오는 중...');
    console.log('URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TakeoffBot/1.0'
      }
    });

    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP 에러: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('\n--- RSS XML 구조 (처음 2000자) ---');
    console.log(xmlText.substring(0, 2000));
    console.log('\n--- RSS XML 구조 끝 ---\n');

    // item 태그 검색
    const itemMatches = xmlText.match(/<item[\s>][\s\S]*?<\/item>/g);
    console.log('발견된 item 태그 수:', itemMatches ? itemMatches.length : 0);

    if (itemMatches && itemMatches.length > 0) {
      console.log('\n--- 첫 번째 아이템 ---');
      console.log(itemMatches[0]);
      console.log('--- 첫 번째 아이템 끝 ---\n');
    }

    // entry 태그도 확인 (Atom 피드인 경우)
    const entryMatches = xmlText.match(/<entry[\s>][\s\S]*?<\/entry>/g);
    console.log('발견된 entry 태그 수:', entryMatches ? entryMatches.length : 0);

    if (entryMatches && entryMatches.length > 0) {
      console.log('\n--- 첫 번째 엔트리 ---');
      console.log(entryMatches[0]);
      console.log('--- 첫 번째 엔트리 끝 ---\n');
    }

    // 피드 타입 확인
    if (xmlText.includes('<rss')) {
      console.log('피드 타입: RSS 2.0');
    } else if (xmlText.includes('<feed')) {
      console.log('피드 타입: Atom');
    } else {
      console.log('피드 타입: 알 수 없음');
    }

  } catch (error) {
    console.error('에러 발생:', error.message);
  }
}

// 실행
debugRedditRSS(); 
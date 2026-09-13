// Storage & Preset Utility for Naver Blog 1 Day 3 Posts Challenge

export const STORAGE_KEY = 'naver_blog_3posts_challenge_data';

export const CATEGORIES = [
  { label: '💡 정보성/IT', color: '#03C75A' },
  { label: '✈️ 여행/맛집', color: '#FF9800' },
  { label: '🛍️ 리뷰/체험단', color: '#E91E63' },
  { label: '📈 재테크/비즈니스', color: '#2196F3' },
  { label: '🌿 일상/생각', color: '#9C27B0' },
  { label: '🎨 자기계발/독서', color: '#00BCD4' },
];

// Generate Initial Sample Data for current month
export function generateSampleData(year, month) {
  const data = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const sampleTitles = [
    ["IT 꿀팁! 네이버 블로그 스마트에디터 200% 활용법", "아이폰 iOS 신기능 총정리 & 설정 가이드", "초보 블로거를 위한 상위노출 키워드 발굴 팁"],
    ["강남역 맛집 추천! 직장인 최애 점심 스팟 리뷰", "주말 성수동 카공 카페 감성 투어 후기", "속초 1박 2일 오션뷰 펜션 내돈내산 추천"],
    ["이번주 네이버 블로그 이웃추가 100명 달성 노하우", "체험단 당첨률 올리는 맞춤형 신청 양식 공유", "월간 1일 3포 챌린지 중간 점검 & 동기부여"],
    ["2026 재테크 가이드: 파킹통장 금리 비교", "직장인 부업으로 시작하는 N잡러 성공기", "자산 배분 포트폴리오 9월 리포트"],
    ["오늘의 일상 소회: 1일 3포 습관이 가져온 변화", "가을 맞이 서재 정리 & 추천 도서 3선", "퇴근 후 30분 운동 챌린지 10일차"]
  ];

  // Fill sample data up to current day (or first 15 days if viewing current month)
  const maxFillDay = (year === currentYear && month === currentMonth) ? Math.min(today, daysInMonth) : Math.min(18, daysInMonth);

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

    if (day <= maxFillDay) {
      // Create completed 3 posts or 2/3 for variation
      const countCompleted = (day === maxFillDay) ? 2 : (day % 4 === 0 ? 2 : 3);
      const titleSetIndex = (day - 1) % sampleTitles.length;

      data[dateKey] = {
        date: dateKey,
        posts: [
          {
            id: 1,
            completed: countCompleted >= 1,
            title: sampleTitles[titleSetIndex][0],
            category: CATEGORIES[0].label,
            url: 'https://blog.naver.com/sample/1',
            image: '',
            note: '오전 8시 발행 완료! 키워드 노출 양호'
          },
          {
            id: 2,
            completed: countCompleted >= 2,
            title: sampleTitles[titleSetIndex][1],
            category: CATEGORIES[1].label,
            url: 'https://blog.naver.com/sample/2',
            image: '',
            note: '점심시간 발행 완료'
          },
          {
            id: 3,
            completed: countCompleted >= 3,
            title: sampleTitles[titleSetIndex][2],
            category: CATEGORIES[2].label,
            url: countCompleted >= 3 ? 'https://blog.naver.com/sample/3' : '',
            image: '',
            note: countCompleted >= 3 ? '퇴근 후 저녁 포스팅 마감!' : '저녁 포스팅 준비 중...'
          }
        ]
      };
    } else {
      // Empty template for future days
      data[dateKey] = {
        date: dateKey,
        posts: [
          { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
          { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
          { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
        ]
      };
    }
  }

  return data;
}

// Generate Clean Empty Data (0% progress for new visitors)
export function generateEmptyData(year, month) {
  const data = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

    data[dateKey] = {
      date: dateKey,
      posts: [
        { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
        { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
        { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
      ]
    };
  }

  return data;
}

// Load data from LocalStorage
export function loadChallengeData(year, month) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First-time visitor: Start with 0% clean empty data (0 posts completed, 0% runner progress)
      const initial = generateEmptyData(year, month);
      saveChallengeData(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load local storage:", e);
    return generateEmptyData(year, month);
  }
}

// Save data to LocalStorage
export function saveChallengeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save local storage:", e);
  }
}

// Calculate Monthly Statistics
export function calculateStats(data, year, month) {
  const formattedMonth = String(month).padStart(2, '0');
  const monthPrefix = `${year}-${formattedMonth}`;
  
  let totalPostsGoal = 0;
  let totalPostsCompleted = 0;
  let totalDaysInMonth = new Date(year, month, 0).getDate();
  let fullCompletedDays = 0; // Days with 3/3 posts
  let partialCompletedDays = 0; // Days with 1 or 2 posts

  totalPostsGoal = totalDaysInMonth * 3;

  const monthEntries = Object.keys(data).filter(key => key.startsWith(monthPrefix));

  monthEntries.forEach(key => {
    const dayData = data[key];
    if (dayData && dayData.posts) {
      const completedCount = dayData.posts.filter(p => p.completed).length;
      totalPostsCompleted += completedCount;
      if (completedCount >= 3) {
        fullCompletedDays++;
      } else if (completedCount > 0) {
        partialCompletedDays++;
      }
    }
  });

  // Calculate Dynamic Realtime Streak
  let streak = 0;
  let maxCompletedDay = 0;

  // 1. Find the highest day in the month that has 3+ posts completed
  for (let d = totalDaysInMonth; d >= 1; d--) {
    const formattedDay = String(d).padStart(2, '0');
    const key = `${year}-${formattedMonth}-${formattedDay}`;
    const dayData = data[key];
    const completedCount = dayData?.posts ? dayData.posts.filter(p => p.completed).length : 0;
    if (completedCount >= 3) {
      maxCompletedDay = d;
      break;
    }
  }

  // 2. From maxCompletedDay, count consecutive 3+ completed days backwards
  if (maxCompletedDay > 0) {
    for (let d = maxCompletedDay; d >= 1; d--) {
      const formattedDay = String(d).padStart(2, '0');
      const key = `${year}-${formattedMonth}-${formattedDay}`;
      const dayData = data[key];
      const completedCount = dayData?.posts ? dayData.posts.filter(p => p.completed).length : 0;

      if (completedCount >= 3) {
        streak++;
      } else {
        break;
      }
    }
  }

  const progressPercent = Math.min(100, Math.round((totalPostsCompleted / totalPostsGoal) * 100));

  return {
    totalDaysInMonth,
    totalPostsGoal,
    totalPostsCompleted,
    fullCompletedDays,
    partialCompletedDays,
    streak,
    progressPercent
  };
}

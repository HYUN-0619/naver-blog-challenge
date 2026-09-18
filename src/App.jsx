import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import RunnerTrack from './components/RunnerTrack';
import GoldenTimeGuide from './components/GoldenTimeGuide';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import ProofCardModal from './components/ProofCardModal';
import AnalyticsSection from './components/AnalyticsSection';
import TrophyGallery from './components/TrophyGallery';
import BlogGuideSection from './components/BlogGuideSection';
import FeedbackBoard from './components/FeedbackBoard';
import GlobalActivityBanner from './components/GlobalActivityBanner';
import PrivacyModal from './components/PrivacyModal';
import TermsModal from './components/TermsModal';
import WelcomeGuideModal from './components/WelcomeGuideModal';
import Footer from './components/Footer';
import { loadChallengeData, saveChallengeData, calculateStats, generateSampleData, CATEGORIES } from './utils/storage';
import { recordChallengeEvent } from './utils/challenge';

export default function App() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'trophy' | 'guide' | 'feedback'

  // Load Challenge Data
  const [challengeData, setChallengeData] = useState(() => {
    return loadChallengeData(today.getFullYear(), today.getMonth() + 1);
  });

  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const hideDate = localStorage.getItem('po3_hide_welcome_date');
    return hideDate !== todayStr;
  });

  // Sync theme attribute to HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Recalculate Statistics
  const stats = useMemo(() => {
    return calculateStats(challengeData, currentYear, currentMonth);
  }, [challengeData, currentYear, currentMonth]);

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  // Day Save Handler
  const handleSaveDay = (dateKey, updatedPosts) => {
    const updated = {
      ...challengeData,
      [dateKey]: {
        date: dateKey,
        posts: updatedPosts
      }
    };
    setChallengeData(updated);
    saveChallengeData(updated);

    // Record challenge event to Cloudflare D1 for global real-time stats
    try {
      const completedPosts = updatedPosts.filter(p => p.completed);
      if (completedPosts.length >= 3) {
        recordChallengeEvent({
          eventType: 'day_finished',
          postNumber: completedPosts.length,
          postTitle: completedPosts[2]?.title || '오늘 3포 완주!',
          category: completedPosts[2]?.category || '일상',
          nickname: '익명의 러너'
        });
      } else if (completedPosts.length > 0) {
        const last = completedPosts[completedPosts.length - 1];
        recordChallengeEvent({
          eventType: 'post_completed',
          postNumber: completedPosts.length,
          postTitle: last?.title || `${completedPosts.length}번째 글 발행`,
          category: last?.category || '일상',
          nickname: '익명의 러너'
        });
      }
    } catch (e) {
      console.debug('Failed to send challenge event:', e);
    }
  };

  // Clear data handler (Clears all 12 months when on trophy tab, or current month when on dashboard tab)
  const handleClearAllData = () => {
    if (activeTab === 'trophy') {
      const emptyYearData = {};
      for (let m = 1; m <= 12; m++) {
        const daysInMonth = new Date(currentYear, m, 0).getDate();
        const formattedMonth = String(m).padStart(2, '0');
        for (let day = 1; day <= daysInMonth; day++) {
          const formattedDay = String(day).padStart(2, '0');
          const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
          emptyYearData[dateKey] = {
            date: dateKey,
            posts: [
              { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
              { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
              { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
            ]
          };
        }
      }
      setChallengeData(emptyYearData);
      saveChallengeData(emptyYearData);
    } else {
      const emptyMonthData = { ...challengeData };
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const formattedMonth = String(currentMonth).padStart(2, '0');

      for (let day = 1; day <= daysInMonth; day++) {
        const formattedDay = String(day).padStart(2, '0');
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
        emptyMonthData[dateKey] = {
          date: dateKey,
          posts: [
            { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
            { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
            { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
          ]
        };
      }
      setChallengeData(emptyMonthData);
      saveChallengeData(emptyMonthData);
    }
  };

  // Batch complete all days of current month with 3/3 posts
  const handleCompleteAllMonth = () => {
    const fullData = {};
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const formattedMonth = String(currentMonth).padStart(2, '0');

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = String(day).padStart(2, '0');
      const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
      const existing = challengeData[dateKey]?.posts;

      fullData[dateKey] = {
        date: dateKey,
        posts: [
          {
            id: 1,
            completed: true,
            title: existing?.[0]?.title || `포스팅 1 발행 완료`,
            category: existing?.[0]?.category || CATEGORIES[0].label,
            url: existing?.[0]?.url || 'https://blog.naver.com/',
            image: existing?.[0]?.image || '',
            note: existing?.[0]?.note || '월간 일괄 3포 완주'
          },
          {
            id: 2,
            completed: true,
            title: existing?.[1]?.title || `포스팅 2 발행 완료`,
            category: existing?.[1]?.category || CATEGORIES[1].label,
            url: existing?.[1]?.url || 'https://blog.naver.com/',
            image: existing?.[1]?.image || '',
            note: existing?.[1]?.note || '월간 일괄 3포 완주'
          },
          {
            id: 3,
            completed: true,
            title: existing?.[2]?.title || `포스팅 3 발행 완료`,
            category: existing?.[2]?.category || CATEGORIES[2].label,
            url: existing?.[2]?.url || 'https://blog.naver.com/',
            image: existing?.[2]?.image || '',
            note: existing?.[2]?.note || '월간 일괄 3포 완주'
          }
        ]
      };
    }

    const updated = { ...challengeData, ...fullData };
    setChallengeData(updated);
    saveChallengeData(updated);

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });

    try {
      recordChallengeEvent({
        eventType: 'day_finished',
        postNumber: 3,
        postTitle: `${currentMonth}월 일괄 완주!`,
        category: '일상',
        nickname: '마스터 러너'
      });
    } catch (e) {}
  };

  // Reset / Reload Sample Data
  const handleResetData = () => {
    const sample = generateSampleData(currentYear, currentMonth);
    setChallengeData(sample);
    saveChallengeData(sample);
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 60px 16px' }}>
      
      {/* Header Navigation & Quick Actions */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        stats={stats}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onResetData={handleResetData}
        onClearAllData={handleClearAllData}
        onOpenProofModal={() => setShowProofModal(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {activeTab === 'dashboard' ? (
        <>
          {/* Global Challenger Real-time Activity Banner & Live Ticker */}
          <GlobalActivityBanner />

          {/* Hero: Running Mascot Track Section */}
          <RunnerTrack
            stats={stats}
            year={currentYear}
            month={currentMonth}
          />

          {/* Naver Blog 1 Day 3 Posts Golden Time Timeline Guide */}
          <GoldenTimeGuide />

          {/* Main Monthly Calendar Grid */}
          <Calendar
            year={currentYear}
            month={currentMonth}
            challengeData={challengeData}
            onSelectDay={(dateKey) => setSelectedDateKey(dateKey)}
            onCompleteAllMonth={handleCompleteAllMonth}
          />

          {/* Analytics & Motivational Quotes */}
          <AnalyticsSection
            challengeData={challengeData}
            year={currentYear}
            month={currentMonth}
            stats={stats}
          />
        </>
      ) : activeTab === 'trophy' ? (
        /* Monthly Trophy Gallery (Hall of Fame) Tab */
        <TrophyGallery
          challengeData={challengeData}
          year={currentYear}
          onSelectMonth={(selectedMonth) => {
            setCurrentMonth(selectedMonth);
            setActiveTab('dashboard');
          }}
          onOpenProofModal={(selectedMonth) => {
            setCurrentMonth(selectedMonth);
            setShowProofModal(true);
          }}
        />
      ) : activeTab === 'guide' ? (
        /* Blogger 1 Day 3 Posts Guide & FAQ Tab */
        <BlogGuideSection />
      ) : (
        /* Canny Style Feature Request & Upvoting Board Tab */
        <FeedbackBoard />
      )}

      {/* Day Edit Modal */}
      {selectedDateKey && (
        <DayModal
          dateKey={selectedDateKey}
          dayData={challengeData[selectedDateKey]}
          onClose={() => setSelectedDateKey(null)}
          onSave={handleSaveDay}
        />
      )}

      {/* Naver Blog Proof Card Modal */}
      {showProofModal && (
        <ProofCardModal
          stats={stats}
          year={currentYear}
          month={currentMonth}
          onClose={() => setShowProofModal(false)}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}

      {/* Terms & About Modal */}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}

      {/* Welcome & User Guide Onboarding Modal */}
      {showWelcomeModal && (
        <WelcomeGuideModal onClose={() => setShowWelcomeModal(false)} />
      )}

      {/* Footer Branding & Legal Links */}
      <Footer
        currentYear={currentYear}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenWelcome={() => setShowWelcomeModal(true)}
      />

    </div>
  );
}

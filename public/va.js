/* =====================================================================
 * 비엘모빌리티 방문 분석 트래커 (React SPA 대응)
 * 수집 → Netlify 엣지펑션(/track) → Supabase blrent_analytics
 *
 * 정적 사이트용 아레스 트래커를 SPA용으로 이식:
 *  - history.pushState/replaceState 패치로 라우트 변경마다 pageview 재전송
 *  - 이전 페이지 체류시간(page_exit)을 라우트 전환 시 기록
 * ===================================================================== */
(function () {
  'use strict';

  // IP·지역(geo)을 서버측에서 부착하기 위해 /track 엣지펑션 경유
  var ENDPOINT = '/track';

  // ---- util ----
  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now(), remain = wait - (now - last);
      if (remain <= 0) { last = now; fn(); }
      else if (!timer) { timer = setTimeout(function () { last = Date.now(); timer = null; fn(); }, remain); }
    };
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function persistentId(store, key) {
    try { var v = store.getItem(key); if (!v) { v = uuid(); store.setItem(key, v); } return v; }
    catch (e) { return null; }
  }

  // ---- 기기 / OS / 브라우저 ----
  var ua = navigator.userAgent;
  function deviceType() {
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
    if (/Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  function osName() {
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Other';
  }
  function browserName() {
    if (/KAKAOTALK/i.test(ua)) return 'KakaoTalk';
    if (/whale/i.test(ua)) return 'Whale';
    if (/NAVER/i.test(ua)) return 'Naver';
    if (/Edg/i.test(ua)) return 'Edge';
    if (/SamsungBrowser/i.test(ua)) return 'Samsung';
    if (/Chrome/i.test(ua)) return 'Chrome';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Safari/i.test(ua)) return 'Safari';
    return 'Other';
  }
  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }

  var refHost = null;
  try { refHost = document.referrer ? new URL(document.referrer).hostname : null; } catch (e) {}

  // 방문자/세션/환경 값은 1회만 계산 (path 만 매 전송 시 갱신)
  var VISITOR = persistentId(window.localStorage, 'bl_vid');
  var SESSION = persistentId(window.sessionStorage, 'bl_sid');
  var DEVICE = deviceType(), OS = osName(), BROWSER = browserName();

  function send(fields) {
    var body = {
      visitor_id: VISITOR,
      session_id: SESSION,
      path: location.pathname + location.search,
      referrer: document.referrer || null,
      referrer_host: refHost,
      utm_source: qs('utm_source'),
      utm_medium: qs('utm_medium'),
      utm_campaign: qs('utm_campaign'),
      device: DEVICE, os: OS, browser: BROWSER,
      screen_w: screen.width, screen_h: screen.height,
      viewport_w: window.innerWidth, viewport_h: window.innerHeight,
      language: navigator.language || null
    };
    for (var k in fields) body[k] = fields[k];
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        keepalive: true, // 페이지 떠날 때도 전송 보장
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(function () {});
    } catch (e) {}
  }

  // ---- 페이지 단위 상태 (SPA 라우팅마다 리셋) ----
  var startTime, maxScroll, scrollSent, exitSent, curPath;
  function startPage() {
    startTime = Date.now(); maxScroll = 0; scrollSent = {}; exitSent = false;
    curPath = location.pathname + location.search;
    send({ event_type: 'pageview' });
  }
  function endPage() {
    if (exitSent) return; exitSent = true;
    send({ event_type: 'page_exit', duration_sec: Math.round((Date.now() - startTime) / 1000), scroll_depth: maxScroll });
  }

  // ---- 스크롤 깊이 (25/50/75/100% 도달 시 1회) ----
  var milestones = [25, 50, 75, 100];
  function onScroll() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    var pct = Math.min(100, Math.round((window.scrollY / docH) * 100));
    if (pct > maxScroll) maxScroll = pct;
    for (var i = 0; i < milestones.length; i++) {
      var m = milestones[i];
      if (maxScroll >= m && !scrollSent[m]) { scrollSent[m] = true; send({ event_type: 'scroll', scroll_depth: m }); }
    }
  }
  window.addEventListener('scroll', throttle(onScroll, 500), { passive: true });

  // ---- 클릭 추적 (전화 / 카카오) — 이벤트 위임이라 SPA 재렌더에도 유효 ----
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var cta = a.getAttribute('data-cta') || null;
    if (href.indexOf('tel:') === 0) send({ event_type: 'click_phone', extra: { href: href, cta: cta } });
    else if (href.indexOf('kakao.com') !== -1) send({ event_type: 'click_kakao', extra: { href: href, cta: cta } });
  }, true);

  // ---- 상담폼 제출 ([data-track-consult] 표시된 폼만) ----
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.matches && f.matches('[data-track-consult]')) send({ event_type: 'submit_consult' });
  }, true);

  // ---- SPA 라우팅 감지: history 패치 + popstate ----
  function onNav() {
    var p = location.pathname + location.search;
    if (p === curPath) return;   // 동일 경로 재호출 무시
    endPage();                   // 이전 페이지 체류시간 기록
    startPage();                 // 새 페이지뷰
  }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); onNav(); return r; };
  });
  window.addEventListener('popstate', onNav);

  // ---- 체류시간 (탭 숨김 / 떠날 때 1회) ----
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') endPage(); });
  window.addEventListener('pagehide', endPage);

  // ---- 시작 ----
  startPage();
})();

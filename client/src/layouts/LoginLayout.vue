<template>
  <div class="login-layout">
    <div class="water-bg">
      <div class="water-circle c1"></div>
      <div class="water-circle c2"></div>
      <div class="water-circle c3"></div>
      <div class="lotus l1"></div>
      <div class="lotus l2"></div>
      <div class="reed r1"></div>
      <div class="reed r2"></div>
      <div class="glow g1"></div>
      <div class="glow g2"></div>
    </div>
    <div class="login-center">
      <div class="login-card-wrap">
        <div class="brand-header">
          <div class="school-badge">雄安新区</div>
          <h1 class="school-name">安新职教中心</h1>
          <p class="slogan">白洋畔 · 育匠心</p>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%);
  position: relative;
  overflow: hidden;
}

.water-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.g1 {
  width: 500px;
  height: 500px;
  background: rgba(59, 130, 246, 0.08);
  top: -200px;
  right: -100px;
}

.g2 {
  width: 400px;
  height: 400px;
  background: rgba(245, 158, 11, 0.05);
  bottom: -150px;
  left: -80px;
}

.water-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.06);
}

.c1 { width: 600px; height: 600px; top: -200px; right: -150px; }
.c2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
.c3 { width: 300px; height: 300px; bottom: 20%; right: 10%; border-color: rgba(255,255,255,0.05); }

.lotus {
  position: absolute;
  width: 40px; height: 40px;
}
.lotus::before {
  content: '';
  position: absolute;
  width: 14px; height: 24px;
  background: rgba(244,114,182,0.15);
  border-radius: 50% 50% 0 0;
  transform-origin: bottom center;
}
.lotus::after {
  content: '';
  position: absolute;
  width: 10px; height: 18px;
  background: rgba(244,114,182,0.1);
  border-radius: 50% 50% 0 0;
  transform-origin: bottom center;
}
.l1 { top: 15%; left: 8%; }
.l1::before { left: 10px; }
.l1::after { left: 15px; }
.l2 { bottom: 20%; right: 20%; }
.l2::before { left: 12px; transform: rotate(15deg); }
.l2::after { left: 16px; transform: rotate(-10deg); }

.reed {
  position: absolute;
  width: 2px;
  background: linear-gradient(to top, transparent, rgba(245,158,11,0.15));
}
.r1 { height: 120px; bottom: 10%; left: 15%; transform: rotate(-10deg); }
.r2 { height: 90px; bottom: 15%; left: 20%; transform: rotate(8deg); }

.login-center {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.login-card-wrap {
  width: 420px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 48px 44px 44px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.brand-header {
  text-align: center;
  margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(30,41,59,0.08);
}

.school-badge {
  display: inline-block;
  padding: 3px 14px;
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 20px;
  font-size: 12px;
  color: #3B82F6;
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.school-name {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.slogan {
  font-size: 14px;
  color: #94A3B8;
  letter-spacing: 6px;
  font-weight: 300;
}
</style>

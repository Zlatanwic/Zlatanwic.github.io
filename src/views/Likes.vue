<script setup lang="ts">
import CircularGallery from '../components/CircularGallery.vue'

const football = {
  club: 'MAN. CITY',
  since: '忠实球迷',
  note: '最爱的不是某场胜利，是这支球队踢球的方式——攻势足球的美丽，永远控制比赛。',
  players: ['DE BRUYNE', 'RODRI', 'FODEN']
}

const games = [
  {
    name: 'GTA V',
    tag: 'OPEN WORLD',
    image: '/games/gta5.jpg',
    note: '反复回到 Los Santos——只为开车在公路上听电台。'
  },
  {
    name: 'CYBERPUNK 2077',
    tag: 'RPG',
    image: '/games/johnny.jpg',
    note: 'Phantom Liberty 之后，夜之城终于配得上它的故事。'
  },
  {
    name: 'RDR 2',
    tag: 'OPEN WORLD',
    image: '/games/ather.jpg',
    note: '到现在仍然觉得它是叙事的天花板。'
  },
  {
    name: 'RESIDENT EVIL SERIES',
    tag: 'SURVIVAL HORROR',
    image: '/games/grace.jpg',
    note: '从洋馆到浣熊市，最迷人的是资源紧张时那种冷静的求生感。'
  }
]

const gameGalleryItems = games.map(game => ({
  image: game.image,
  text: game.name
}))

const others = [
  { label: '阅读', items: ['长稿非虚构', '系统类教科书', '少量科幻'] },
  { label: '音乐', items: ['POST-ROCK', 'LO-FI', '电影原声'] },
  { label: '近期想做', items: ['入门dl compiler', '继续学习算子优化', '看完 Mamba & Ring Attention'] }
]
</script>

<template>
  <article>
    <header class="head">
      <span class="kicker">LIKES / 写代码之外</span>
      <h1 class="display display-xl">OFF&nbsp;THE&nbsp;CLOCK.</h1>
      <p class="lede">
        生活里那些和 GPU 没关系、但同样重要的事。
      </p>
    </header>

    <!-- Football color block -->
    <section class="football">
      <span class="kicker kicker-uv">FOOTBALL · 蓝月亮</span>
      <div class="football-row">
        <h2 class="football-title display display-lg">{{ football.club }}</h2>
        <span class="label-meta football-since">SINCE FOREVER · {{ football.since }}</span>
      </div>
      <p class="football-note">{{ football.note }}</p>
      <div class="players">
        <span v-for="n in football.players" :key="n" class="tag tag--ghost player-tag">{{ n }}</span>
      </div>
    </section>

    <hr class="rule" />

    <!-- Games stream -->
    <section>
      <div class="section-head">
        <span class="kicker">GAMES / 单机</span>
        <h2 class="display display-lg">RUN&nbsp;IT&nbsp;BACK.</h2>
      </div>
      <div class="game-gallery">
        <CircularGallery
          :items="gameGalleryItems"
          :bend="2"
          :border-radius="0.08"
          :scroll-speed="2.2"
          :scroll-ease="0.06"
          text-color="#3cffd0"
          font="bold 28px JetBrains Mono"
        />
      </div>
      <div class="game-grid game-notes">
        <article v-for="(g, i) in games" :key="g.name" class="game" :data-fill="i % 4">
          <div class="game-head">
            <span class="kicker tile-kicker">{{ g.tag }}</span>
            <span class="num label-meta">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="game-name display">{{ g.name }}</h3>
          <p class="game-note">{{ g.note }}</p>
        </article>
      </div>
    </section>

    <hr class="rule" />

    <!-- Misc columns -->
    <section class="others">
      <div v-for="o in others" :key="o.label" class="other">
        <span class="kicker">{{ o.label }}</span>
        <ul>
          <li v-for="i in o.items" :key="i">{{ i }}</li>
        </ul>
      </div>
    </section>
  </article>
</template>

<style scoped>
.head {
  padding: clamp(1rem, 2vw, 2rem) 0 clamp(1.5rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--hairline-dim);
  display: grid;
  gap: 1rem;
}
.head h1 { margin: 0; }

.football {
  margin-top: clamp(2rem, 3vw, 3rem);
  background: var(--tile-uv);
  color: var(--white);
  border: 1px solid var(--uv-rule);
  border-radius: 24px;
  padding: clamp(1.6rem, 2.5vw, 2.6rem);
  display: grid;
  gap: 0.8rem;
}
.football .kicker { color: var(--mint); }
.football-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}
.football-title { margin: 0; color: var(--white); }
.football-since { color: rgba(255, 255, 255, 0.7); }
.football-note {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.6;
  max-width: 60ch;
}
.players {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.player-tag {
  border-color: rgba(255, 255, 255, 0.55);
  color: var(--white);
}

.section-head {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.section-head h2 { margin: 0; }

.game-gallery {
  height: clamp(320px, 46vw, 520px);
  border: 1px solid var(--hairline);
  border-radius: 24px;
  background: var(--canvas);
  overflow: hidden;
  margin-bottom: 1rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.game-notes {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.game {
  border-radius: 20px;
  padding: 1.4rem 1.5rem;
  border: 1px solid var(--hairline);
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 170px;
  transition: border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.game:hover {
  border-color: var(--mint);
}
.game-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.game-name {
  margin: 0;
  font-size: clamp(1.6rem, 1.1rem + 1vw, 2.2rem);
  letter-spacing: 0.01em;
  line-height: 0.95;
}
.game-note {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.55;
}
.game[data-fill='1'] {
  background: var(--tile-mint);
  border-color: var(--mint-border);
  color: var(--black);
}
.game[data-fill='1'] .game-note { color: rgba(0,0,0,0.78); }
.game[data-fill='1'] .kicker { color: var(--uv); }
.game[data-fill='1'] .num { color: var(--uv); }

.game[data-fill='3'] {
  background: var(--tile-yellow);
  border-color: #b39800;
  color: var(--black);
}
.game[data-fill='3'] .game-note { color: rgba(0,0,0,0.78); }
.game[data-fill='3'] .kicker { color: var(--uv); }
.game[data-fill='3'] .num { color: var(--uv); }

.others {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.other ul {
  list-style: none;
  padding: 0;
  margin: 0.7rem 0 0;
  display: grid;
  gap: 0.4rem;
}
.other li {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: var(--text);
  padding: 0.55rem 0;
  border-top: 1px dashed var(--hairline-dim);
}
.other li:last-child {
  border-bottom: 1px dashed var(--hairline-dim);
}
</style>

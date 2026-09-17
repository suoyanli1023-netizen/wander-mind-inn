// 二选一题库（30+题，每次随机抽取10题；aw/bw 为情绪权重：-1=低沉/内敛，+1=明亮/外向）
const CHOICE_QUESTION_POOL = [
  { q: '今天你想…', a: '安静地待在家里', b: '出去走走吹吹风', aw: -1, bw: 1 },
  { q: '你更喜欢…', a: '和好朋友聊天', b: '一个人看看书', aw: 1, bw: -1 },
  { q: '现在的心情是…', a: '想喝杯热茶', b: '想吃点甜的', aw: 0, bw: 1 },
  { q: '周末你想…', a: '睡到自然醒', b: '早起看日出', aw: -1, bw: 1 },
  { q: '你更需要…', a: '一个温暖的拥抱', b: '一句温柔的话', aw: 1, bw: 0 },
  { q: '下雨天你更想…', a: '窝在沙发听雨声', b: '在雨里慢慢走', aw: -1, bw: 1 },
  { q: '你希望被这样安慰…', a: '「我在这里陪你」', b: '「一切都会好的」', aw: 1, bw: 0 },
  { q: '你现在的能量是…', a: '想静静充电', b: '想做点小事情', aw: -1, bw: 1 },
  { q: '你更想收到…', a: '一束小花', b: '一封手写信', aw: 1, bw: 0 },
  { q: '闭上眼睛，你想到的是…', a: '一片宁静的湖', b: '一片柔软的云', aw: -1, bw: 0 },
  { q: '此刻你更想听…', a: '轻柔的钢琴曲', b: '欢快的尤克里里', aw: -1, bw: 1 },
  { q: '你觉得身体需要…', a: '好好睡一觉', b: '出去跑一跑', aw: -1, bw: 1 },
  { q: '面对今天的事，你想…', a: '先放一放再说', b: '马上动手去做', aw: -1, bw: 1 },
  { q: '你更想待在…', a: '温暖的灯光下', b: '明亮的阳光下', aw: 0, bw: 1 },
  { q: '想到一个颜色，你选…', a: '柔和的蓝', b: '明亮的黄', aw: -1, bw: 1 },
  { q: '你现在想喝…', a: '一杯温热的牛奶', b: '一杯清爽的气泡水', aw: 0, bw: 1 },
  { q: '如果有一小时空闲…', a: '发呆放空', b: '给朋友打个电话', aw: -1, bw: 1 },
  { q: '你更想要的陪伴是…', a: '安静地在同一空间', b: '热热闹闹地聊天', aw: 0, bw: 1 },
  { q: '现在的你像…', a: '一只蜷缩的猫', b: '一只奔跑的小狗', aw: -1, bw: 1 },
  { q: '你更想看的风景是…', a: '雾蒙蒙的森林', b: '开满花的山坡', aw: -1, bw: 1 },
  { q: '你此刻的感受接近…', a: '像雨天一样安静', b: '像晴天一样明亮', aw: -1, bw: 1 },
  { q: '你更想穿…', a: '柔软宽松的家居服', b: '轻便的外出衣服', aw: -1, bw: 1 },
  { q: '如果可以选一种天气…', a: '阴天，适合宅着', b: '晴天，适合出门', aw: -1, bw: 1 },
  { q: '你更想做的运动是…', a: '瑜伽，慢慢伸展', b: '散步，走走停停', aw: -1, bw: 0 },
  { q: '你此刻最想闻到的味道…', a: '淡淡的薰衣草', b: '清新的柑橘', aw: -1, bw: 1 },
  { q: '如果有一首歌为你播放…', a: '缓慢温柔的民谣', b: '轻快明亮的小调', aw: -1, bw: 1 },
  { q: '你更想在哪里发呆…', a: '窗边看雨', b: '阳台晒太阳', aw: -1, bw: 1 },
  { q: '你现在的步调想…', a: '慢慢来，不着急', b: '稍微走快一点点', aw: -1, bw: 1 },
  { q: '你更想写下来的东西是…', a: '心里藏着的小心事', b: '今天发生的开心事', aw: -1, bw: 1 },
  { q: '你觉得今天缺了一点…', a: '安静独处的时间', b: '和人分享的瞬间', aw: -1, bw: 1 },
  { q: '你更想摸到的触感…', a: '毛茸茸的毯子', b: '凉凉的水珠', aw: -1, bw: 1 },
  { q: '如果此刻有一个拥抱…', a: '长长地抱一会儿', b: '轻轻碰一下就好', aw: 0, bw: 1 }
];
const CHOICE_QUESTIONS_COUNT = 10;

// =============================================================
// 模块4: 此刻心意二选一
// =============================================================
function initChoicePage() {
  const resumeBtn = document.getElementById('choice-resume-btn');
  const resumeIdx = document.getElementById('choice-resume-idx');
  if (STATE.choiceState.idx > 0 && STATE.choiceState.questions.length > 0
      && STATE.choiceState.idx < STATE.choiceState.questions.length) {
    resumeBtn.style.display = 'block';
    resumeIdx.textContent = STATE.choiceState.idx + 1;
  } else {
    resumeBtn.style.display = 'none';
  }
}

function resumeChoice() {
  SoundFX.click();
  document.getElementById('choice-start').classList.add('hidden');
  document.getElementById('choice-content').classList.remove('hidden');
  document.getElementById('choice-result').classList.add('hidden');
  renderChoice();
}

function startChoice() {
  SoundFX.click();
  document.getElementById('choice-start').classList.add('hidden');
  document.getElementById('choice-content').classList.remove('hidden');
  document.getElementById('choice-result').classList.add('hidden');
  STATE.choiceState.idx = 0;
  STATE.choiceState.answers = [];
  STATE.choiceState.saved = false;
  SoundFX.resetMoodIntensity();
  // 从题库随机抽取（Fisher-Yates 洗牌）
  const pool = [...CHOICE_QUESTION_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  STATE.choiceState.questions = pool.slice(0, CHOICE_QUESTIONS_COUNT);
  saveToStorage();
  renderChoice();
}

function getChoiceQuestions() {
  return STATE.choiceState.questions.length > 0
    ? STATE.choiceState.questions
    : CHOICE_QUESTION_POOL.slice(0, CHOICE_QUESTIONS_COUNT);
}

function renderChoice() {
  const idx = STATE.choiceState.idx;
  const questions = getChoiceQuestions();
  if (idx >= questions.length) {
    showChoiceResult();
    return;
  }

  // 进度
  const progress = document.getElementById('choice-progress');
  progress.innerHTML = questions.map((_, i) => {
    let cls = 'choice-dot';
    if (i < idx) cls += ' done';
    else if (i === idx) cls += ' current';
    return `<span class="${cls}"></span>`;
  }).join('');

  const q = questions[idx];
  document.getElementById('choice-question').textContent = q.q;
  document.getElementById('choice-options').innerHTML = `
    <button class="choice-btn" onclick="answerChoice(0)">${q.a}</button>
    <button class="choice-btn" onclick="answerChoice(1)">${q.b}</button>
  `;
}

function answerChoice(optionIdx) {
  const questions = getChoiceQuestions();
  const q = questions[STATE.choiceState.idx];
  if (!q) return;
  const chosenText = optionIdx === 0 ? q.a : q.b;
  const weight = optionIdx === 0 ? (q.aw || 0) : (q.bw || 0);
  SoundFX.choice();
  SoundFX.adjustMood(weight);
  STATE.choiceState.answers.push(chosenText);
  STATE.choiceState.idx++;
  saveToStorage();
  renderChoice();
}

function saveChoiceProgress() {
  STATE.choiceState.saved = true;
  saveToStorage();
  alert('💾 进度已保存！回到首页后可以继续完成。');
}

function showChoiceResult() {
  SoundFX.complete();
  document.getElementById('choice-content').classList.add('hidden');
  const resultDiv = document.getElementById('choice-result');
  resultDiv.classList.remove('hidden');

  const answers = STATE.choiceState.answers;
  const questions = getChoiceQuestions();
  const totalQ = questions.length || answers.length;

  // 分析情绪需求（关键词匹配，兼容随机题目）
  const needs = [];
  if (answers.filter(a => a.includes('安静') || a.includes('一个人') || a.includes('窝') || a.includes('发呆') || a.includes('蜷缩') || a.includes('宅') || a.includes('放空') || a.includes('独处')).length > 2) needs.push('需要独处和安静的时间');
  if (answers.filter(a => a.includes('出去') || a.includes('早起') || a.includes('走走') || a.includes('跑') || a.includes('奔跑') || a.includes('出门') || a.includes('快一点')).length > 2) needs.push('渴望新鲜空气和行动');
  if (answers.filter(a => a.includes('拥抱') || a.includes('陪我') || a.includes('朋友') || a.includes('聊天') || a.includes('分享') || a.includes('电话')).length > 2) needs.push('渴望情感连接和陪伴');
  if (answers.filter(a => a.includes('甜') || a.includes('花') || a.includes('信') || a.includes('阳光') || a.includes('柑橘') || a.includes('开心') || a.includes('晴')).length > 2) needs.push('需要温柔的小确幸');
  if (needs.length === 0) needs.push('需要安静地觉察自己的感受');

  // 权重分析：计算内向/外向倾向
  let totalWeight = 0;
  let weightCount = 0;
  answers.forEach((ans, i) => {
    const q = questions[i];
    if (q && q.aw !== undefined && q.bw !== undefined) {
      weightCount++;
      if (ans === q.a) totalWeight += q.aw;
      else if (ans === q.b) totalWeight += q.bw;
    }
  });
  const avgWeight = weightCount > 0 ? (totalWeight / weightCount).toFixed(2) : 0;
  const direction = avgWeight > 0.15 ? '外向活跃' : (avgWeight < -0.15 ? '内向安静' : '平衡中性');

  // 构建 interpretation 数据
  const needsStr = needs.join('；');
  const needsDetail = needs.map(n => {
    if (n.includes('独处')) return '你可能更需要自主性——按自己的节奏存在，不被打扰。SDT（Deci & Ryan, 2000）认为，自主性需要是心理健康的基石之一，此刻你正在温柔地回应这份需要。';
    if (n.includes('行动')) return '你可能更需要胜任感——通过行动和探索来感受效能。身体在呼唤运动，这本身就是一种自我调节的信号。';
    if (n.includes('连接')) return '你可能更需要关系性——与他人建立温暖联结。SDT认为关系性需要与自主性同等重要，渴望联结不是软弱，而是人性的自然表达。';
    if (n.includes('小确幸')) return '你可能正在寻求温柔的感官安抚——甜味、花香、阳光，这些微小的愉悦是Damasio（1994）所说的"躯体标记"在为你导航，告诉你什么能让此刻的你感到被滋养。';
    if (n.includes('觉察')) return '你的需求可能还没有在选项中完全浮现——这很正常。有时候最深刻的自我照护就是安静地觉察，不急于给出答案。';
    return '';
  }).filter(Boolean).join(' ');

  const comfort = getChoiceComfortMessage(answers, questions, direction);

  resultDiv.innerHTML = `
    <div class="sticker-result">
      <div class="resonance-box">
        <div class="resonance-text">${comfort}</div>
      </div>
      <div class="card">
        <div class="card-title">☁️ 你的情绪需求</div>
        <p style="font-size:14px;color:var(--text-light);line-height:1.8;">
          通过这${totalQ}道温柔的选择，我们看到你内心的一些声音：
        </p>
        <ul style="margin-top:8px;">
          ${needs.map(n => `<li style="font-size:13px;color:var(--text);line-height:1.8;list-style:none;padding:4px 0;">🌱 ${n}</li>`).join('')}
        </ul>
        <p style="font-size:12px;color:var(--text-muted);margin-top:8px;font-style:italic;">
          这些只是你此刻的倾向，没有对错，<br>只需觉察——看见自己的需求，就是温柔的开始。
        </p>
      </div>
      <div class="collapse-wrap" style="margin-top:16px;">
        <div class="collapse-trigger" onclick="toggleCollapse('choice-interpret')">
          <span class="arrow">▸</span> 决策偏好专业解读（APA7）
        </div>
        <div class="collapse-content" id="choice-interpret">
          ${buildChoiceInterpretation(totalQ, needsStr, needsDetail, direction, avgWeight, answers, questions)}
        </div>
      </div>
      <div style="margin-top:16px;padding:20px;background:#f0f4f8;border-radius:16px;">
        <div style="font-size:48px;margin-bottom:8px;">☁️</div>
        <div style="font-size:16px;font-weight:600;color:var(--text);">云朵·情绪需求贴纸</div>
        <div style="font-size:13px;color:var(--text-light);margin-top:4px;">已存入「我的情绪旅程」</div>
      </div>
      <div class="btn-center-row mt-16">
        <button class="btn-primary" onclick="addStickerAndBack('☁️', '云朵·情绪需求', 'calm')">💾 保存贴纸并返回</button>
      </div>
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ====== 此刻心意：温馨安慰话语 ======
function getChoiceComfortMessage(answers, questions, direction) {
  const allText = answers.join('');
  const parts = [];

  // 基于选择倾向的共情
  if (direction === '内向安静') {
    if (/蜷缩|窝|宅|睡|放空|发呆|静静|家居服|毯子/.test(allText)) {
      parts.push(`看起来你好像有点累了，想把自己缩起来、藏起来。不过没关系——你刚才的每一个选择都在说同一句话："我需要休息。"能听见自己身体的这个声音，并且愿意回应它，这本身就是一种很深的自我照顾。你不是在逃避，你是在充电。`);
    } else if (/安静|一个人|独处|心事|慢慢|窗边|雨/.test(allText)) {
      parts.push(`看起来你此刻想要一个安静的角落。不过你知道吗，选择"安静"不是因为不喜欢热闹，而是因为你的内心正在处理一些东西，它需要空间。你刚才做的每一个选择，都是在温柔地给自己腾出这个空间。`);
    } else {
      parts.push(`看起来你此刻更想向内走。不过这很好——向内不是封闭，而是在自己的世界里找到安宁。你刚才的每一次选择，都是一次对自己的倾听。`);
    }
  } else if (direction === '外向活跃') {
    if (/跑|奔跑|早起|日出|快|出门|动手|走/.test(allText)) {
      parts.push(`看起来你现在充满了能量，想要动起来！不过这很棒——你的身体在告诉你它准备好了，它想要拥抱世界。这份行动力是你此刻最珍贵的资源，好好用它，但也别忘了在奔跑的间隙允许自己喘口气。`);
    } else if (/朋友|聊天|分享|电话|热闹|拥抱|陪我/.test(allText)) {
      parts.push(`看起来你此刻渴望和人在一起。不过这份渴望很美好——你在主动寻找联结，这说明你的心是打开的、温暖的。想被陪伴不是软弱，是你作为一个活生生的人在向世界发出健康的信号。`);
    } else {
      parts.push(`看起来你此刻想往外走、想去做点什么。不过这很好——你的心在向往新鲜和行动，这份"想要"本身就是生命力在流动的证据。`);
    }
  } else {
    parts.push(`看起来你的内心此刻是平衡的，既想要安静也想要连接，既想休息也想行动。不过这种"两面都有"的状态其实是最真实的——人从来不是单一的。你刚才的每一次选择，都在展现你内心的丰富和弹性。`);
  }

  // 基于安慰方式选择的特别共情
  if (/拥抱|抱一会儿|毯子/.test(allText) && !/温柔的话|信|陪你|都会好/.test(allText)) {
    parts.push(`你选了"拥抱"而不是"话语"——也许此刻你的身体比耳朵更需要被安慰。一个真实的拥抱，有时候比一千句道理都管用。如果身边没人抱你，就抱抱自己吧——双手交叉抱住肩膀，用力一点，真的有用。`);
  } else if (/温柔的话|信|陪你|都会好/.test(allText) && !/拥抱|抱一会儿|毯子/.test(allText)) {
    parts.push(`你选了"话语"而不是"拥抱"——也许此刻你更需要被理解、被看见，而不只是被触碰。那么让我告诉你：你刚才认真对待自己每一个感受的样子，就已经值得被温柔地对待了。`);
  }

  return parts.join(' ');
}

// ====== 此刻心意：基于用户选择模式的深度心理分析 ======
function buildChoiceInterpretation(totalQ, needsStr, needsDetail, direction, avgWeight, answers, questions) {
  const ref = `<p style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
    <strong>参考文献</strong><br>
    Bowlby, J. (1969). <em>Attachment and loss: Vol. 1. Attachment</em>. Basic Books.<br>
    Damasio, A. R. (1994). <em>Descartes' error</em>. Putnam.<br>
    Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. <em>Psychological Inquiry</em>, 11(4), 227–268.<br>
    Higgins, E. T. (1997). Beyond pleasure and pain. <em>American Psychologist</em>, 52(12), 1280–1300.<br>
    Kahneman, D. (2011). <em>Thinking, fast and slow</em>. Farrar, Straus and Giroux.<br>
    Mikulincer, M., & Shaver, P. R. (2007). <em>Attachment in adulthood</em>. Guilford Press.<br>
    Payne, J. W., et al. (1993). <em>The adaptive decision maker</em>. Cambridge University Press.<br>
    Porges, S. W. (2011). <em>The polyvagal theory</em>. W. W. Norton & Company.<br>
    Ryan, R. M., & Deci, E. L. (2017). <em>Self-determination theory</em>. Guilford Press.<br>
    Schwartz, B. (2004). <em>The paradox of choice</em>. HarperCollins.
  </p>`;

  // ====== 多维度选择模式分析 ======
  let solitudeCount = 0, socialCount = 0;
  let restCount = 0, actionCount = 0;
  let physicalComfortCount = 0, emotionalComfortCount = 0;
  let quietToneCount = 0, brightToneCount = 0;
  let safetySeekCount = 0, explorationCount = 0;

  // 收集用户的具体选择，用于展示
  const choicePairs = [];
  answers.forEach((ans, i) => {
    const q = questions[i];
    if (!q) return;
    choicePairs.push({ q: q.q, chosen: ans, other: ans === q.a ? q.b : q.a });
    if (/安静|一个人|窝|发呆|蜷缩|宅|放空|独处|静静|书|心事|家居服|窗边看雨/.test(ans)) solitudeCount++;
    if (/出去|朋友|聊天|分享|电话|热闹|奔跑|出门|给朋友/.test(ans)) socialCount++;
    if (/睡|休息|放一放|慢慢|充电|瑜伽|放空|发呆/.test(ans)) restCount++;
    if (/早起|跑|奔跑|马上|走快|动手|出去跑/.test(ans)) actionCount++;
    if (/拥抱|毯子|抱一会儿|毛茸茸/.test(ans)) physicalComfortCount++;
    if (/温柔的话|信|陪你|都会好的|手写信/.test(ans)) emotionalComfortCount++;
    if (/雨天|阴天|蓝|雾|森林|雨声|蜷缩|缓慢|安静|薰衣草|民谣|阴/.test(ans)) quietToneCount++;
    if (/晴天|黄|花|阳光|明亮|欢快|柑橘|小调|晴|开心/.test(ans)) brightToneCount++;
    if (/窝|蜷缩|家居服|毯子|窝在|宅|安全|包裹|温暖.*灯/.test(ans)) safetySeekCount++;
    if (/出去|奔跑|日出|走|快|阳光|山坡|开满花/.test(ans)) explorationCount++;
  });

  // ====== 第一部分：你的选择在说什么 ======
  const directionDesc = {
    '内向安静': `你的选择权重为 ${avgWeight}，整体明显偏向"向内"。但"向内"不是退——Deci & Ryan（2000）的自我决定理论指出，当你反复选择"一个人""安静""慢慢来"时，往往是你此刻的<strong>自主性需要</strong>在发出最响亮的信号：你需要按自己的节奏存在，不被打扰、不被催促。这不是"社交退缩"，而是你的心理系统正在主动进行自我恢复。Porges（2011）的多迷走神经理论进一步解释：当你选择"蜷缩""窝着""柔软的家居服"时，你的副交感神经系统正在试图激活"安全感回路"——你的身体在帮你进入修复模式。`,
    '外向活跃': `你的选择权重为 ${avgWeight}，整体明显偏向"向外"。Deci & Ryan（2000）指出，当你反复选择"出去""动起来""和朋友在一起"时，往往是你的<strong>胜任感和关系性需要</strong>在同时寻求满足——你通过行动来感受"我能行"，通过联结来感受"我不孤单"。Higgins（1997）的调节聚焦理论将这种模式称为"促进型聚焦"（Promotion Focus）：你的注意力被"可能获得什么"所吸引，而不是"可能失去什么"。这说明你此刻的心理资源是充足的，你感到自己有能力去探索。`,
    '平衡中性': `你的选择权重为 ${avgWeight}，整体在"向内"和"向外"之间保持了平衡。这并不是"没有倾向"，而是Ryan & Deci（2017）所说的<strong>心理弹性</strong>（Psychological Flexibility）的体现——你能够在独处与联结、休息与行动之间灵活切换，而不是被某一种需要"绑架"。Kahneman（2011）在双系统理论中指出，能够在两个选项之间做出不同选择的人，往往使用了更多的"系统2"（审慎思考）而不是纯直觉的"系统1"。你此刻的状态是清醒的、有觉察的。`
  };

  // ====== 第二部分：你如何寻求安慰——依恋维度的投射 ======
  let comfortInsight = '';
  if (physicalComfortCount > emotionalComfortCount && physicalComfortCount > 0) {
    comfortInsight = `在有安慰相关的题目中，你更倾向于选择<strong>身体性的安慰</strong>——"拥抱""毛茸茸的毯子""长长地抱一会儿"。Bowlby（1969）的依恋理论指出，当一个人在脆弱时刻寻求身体接触而非语言安慰时，往往意味着ta此刻正在激活<strong>依恋系统的"接近性寻求"</strong>（Proximity Seeking）——不是需要道理，而是需要"另一个人在身边的物理感觉"。Mikulincer & Shaver（2007）进一步指出，这种偏好并不代表"不独立"，恰恰相反——能够明确知道自己需要什么形式的安慰，本身就是安全型依恋的特征。你此刻的内心在说："我需要被实实在在地接住，而不只是被言语安慰。"`;
  } else if (emotionalComfortCount > physicalComfortCount && emotionalComfortCount > 0) {
    comfortInsight = `在有安慰相关的题目中，你更倾向于选择<strong>语言/符号性的安慰</strong>——"温柔的话""手写信""一切都会好的"。Mikulincer & Shaver（2007）指出，当一个人在脆弱时刻寻求语言而非触碰时，往往意味着ta此刻更需要<strong>认知层面的确认</strong>——被理解、被看见、被承诺。Damasio（1994）的躯体标记假说给出了另一个视角：也许你此刻的身体感受还不够清晰，你需要语言来帮自己"命名"这份感受，然后才能开始处理它。你此刻的内心在说："我需要知道有人在听我、懂我，而不只是拍拍我的肩。"`;
  } else if (physicalComfortCount > 0 && emotionalComfortCount > 0) {
    comfortInsight = `你在安慰方式的选择上没有明显偏向——有时选身体性的"拥抱"，有时选语言性的"温柔的话"。Mikulincer & Shaver（2007）将这种灵活称为<strong>安全型依恋的标志</strong>：你不执着于单一形式的安慰，而是根据具体情境选择最合适的那一种。这说明你的情绪调节策略是多元的、有弹性的。`;
  } else {
    comfortInsight = `在本次题目中，安慰相关的题目较少或你的选择没有呈现明显倾向。这本身也是一种信息——也许此刻你的注意力不在"如何被安慰"上，而在其他更迫切的需求上。`;
  }

  // ====== 第三部分：你的感官世界——Damasio躯体标记 ======
  let sensoryInsights = [];
  if (quietToneCount > brightToneCount + 1) {
    sensoryInsights.push(`你的选择反复指向<strong>安静、低饱和的感官世界</strong>——雨天、阴天、蓝色、薰衣草、雾蒙蒙的森林、缓慢的民谣。Damasio（1994）的躯体标记假说指出，这种一致的偏好不是偶然——你的身体正在用"安静"这个标记告诉你：此刻你需要降低刺激强度。Higgins（1997）会将这归类为"预防型聚焦"（Prevention Focus）——你的注意力被"需要避免什么"（过度刺激、嘈杂、消耗）所引导。这往往出现在心理资源已经消耗较多、需要恢复的时刻。`);
  } else if (brightToneCount > quietToneCount + 1) {
    sensoryInsights.push(`你的选择反复指向<strong>明亮、高能量的感官世界</strong>——晴天、黄色、阳光、柑橘、开满花的山坡、欢快的小调。Damasio（1994）会称之为"积极的躯体标记"在引导你——你的身体正在被"明亮"所吸引，说明你此刻的心理系统处于"获取模式"而非"保护模式"。Higgins（1997）的促进型聚焦理论指出，这种偏好往往出现在心理资源充足、对世界保持开放态度的时刻。你不是在寻找安慰，你是在寻找"更多"。`);
  } else {
    sensoryInsights.push(`你的感官偏好没有极端偏向——有时选安静的蓝，有时选明亮的黄；有时想听民谣，有时想听小调。Damasio（1994）的躯体标记理论指出，这种"两面都有"的状态说明你的情绪系统此刻是灵活的、不僵化的——你既不急于关闭感官，也不急于扩张，而是在两者之间找到当下最合适的节奏。`);
  }

  // ====== 第四部分：独处 vs 联结——关系性需要的信号 ======
  let relationalInsight = '';
  if (solitudeCount > socialCount + 2) {
    relationalInsight = `你在大部分题目中选择了"一个人""安静""独处"。Deci & Ryan（2000）会指出：此刻你的<strong>自主性需要</strong>显著高于关系性需要。但请注意一个重要的区分——Ryan & Deci（2017）强调，"选择的独处"（Solitude）和"被迫的孤独"（Loneliness）是完全不同的。你是在<strong>主动选择</strong>独处，这意味着你的内心正在说："我需要先和自己待一会儿，才能再去面对关系。"这不是在拒绝世界，而是在为下一次打开世界做准备。`;
  } else if (socialCount > solitudeCount + 2) {
    relationalInsight = `你在大部分题目中选择了"和朋友""聊天""分享""热闹"。Deci & Ryan（2000）会指出：此刻你的<strong>关系性需要</strong>（Relatedness）非常突出——你渴望被看见、被回应、被联结。Mikulincer & Shaver（2007）指出，主动寻求联结是安全依恋系统的正常激活——你的内心在说："此刻我最需要的不是一个人扛，而是有人和我在一起。"这不是依赖，这是人性。`;
  } else {
    relationalInsight = `你在独处与联结之间保持了平衡——有时选"一个人"，有时选"和朋友"。Ryan & Deci（2017）指出，这种平衡恰恰是心理健康的理想状态：你既不害怕独处，也不回避联结，能够根据情境灵活选择。这说明你的关系性需要和自主性需要都没有处于"饥渴"状态。`;
  }

  // ====== 第五部分：休息 vs 行动——能量状态的信号 ======
  let energyInsight = '';
  if (restCount > actionCount + 2) {
    energyInsight = `你反复选择"睡到自然醒""放空""慢慢来""充电"。Porges（2011）的多迷走神经理论给出了解释：当你反复选择"休息""静止""柔软"时，你的腹侧迷走神经正在试图激活——这是身体进入"安全与修复"模式的信号。你的内心在说："我已经输出太多了，现在需要被输入。"这不是懒，这是你的神经系统在帮你做预算。`;
  } else if (actionCount > restCount + 2) {
    energyInsight = `你反复选择"早起""奔跑""马上动手""走快一点"。Higgins（1997）的调节聚焦理论将此解读为"促进型聚焦"的典型表现——你的注意力被"可以做什么"所吸引，而非"需要避免什么"。这说明你此刻的心理能量是充足的、向外流动的。但也要温柔地提醒：行动是好事，偶尔停下来确认方向，能让行动更有力量。`;
  } else {
    energyInsight = `你在休息与行动之间保持了平衡。Kahneman（2011）指出，这种平衡意味着你的"系统1"（直觉）和"系统2"（审慎）都在正常运作——你既没有被倦怠拖着走，也没有被焦虑推着跑。你的能量状态是健康的。`;
  }

  // ====== 第六部分：特别值得注意的组合 ======
  let comboInsight = '';
  if (safetySeekCount >= 3 && quietToneCount >= 3) {
    comboInsight = `<p style="margin-top:8px;"><strong>特别值得注意的组合</strong><br>你同时高频选择了"窝着""蜷缩""柔软"等<strong>寻求安全感</strong>的选项，和"雨天""蓝色""安静"等<strong>低刺激</strong>的感官选项。Porges（2011）的多迷走神经理论指出，这种组合往往出现在身体正在发出"我需要进入修复模式"的信号时——你的神经系统在帮你寻找一个安全的、柔软的、低刺激的环境来恢复。这不是逃避，这是你身体最智慧的自我保护机制在运作。给它一点时间就好。</p>`;
  } else if (explorationCount >= 3 && brightToneCount >= 3) {
    comboInsight = `<p style="margin-top:8px;"><strong>特别值得注意的组合</strong><br>你同时高频选择了"出去""奔跑""阳光"等<strong>向外探索</strong>的选项，和"晴天""黄色""明亮"等<strong>高能量</strong>的感官选项。Higgins（1997）会将这种组合解读为"促进型聚焦"的全面激活——你的整个心理系统都处于"获取模式"，你感到世界是安全的、充满可能性的。这是一种非常宝贵的状态，好好利用它。</p>`;
  } else if (solitudeCount >= 3 && socialCount >= 3) {
    comboInsight = `<p style="margin-top:8px;"><strong>特别值得注意的组合</strong><br>你既多次选择了独处，又多次选择了与人联结。这看似矛盾，其实非常真实——Mikulincer & Shaver（2007）指出，这往往意味着你<strong>既需要自己的空间，又害怕真正的孤立</strong>。你不是在"独处"和"社交"之间二选一，你是在寻找一种"既被允许做自己、又不会失去联结"的状态。这种需求很合理——你想要的是"在场但不被打扰"的陪伴。</p>`;
  }

  // ====== 第七部分：你的完整选择记录 ======
  const choicesHTML = choicePairs.map((p, i) =>
    `<div style="font-size:12px;color:var(--text-light);padding:3px 0;border-bottom:1px dashed rgba(0,0,0,0.06);">
      <span style="color:var(--text-muted);">Q${i+1}. ${p.q}</span><br>
      <span style="color:var(--text);">✓ ${p.chosen}</span>
      <span style="color:var(--text-muted);font-size:11px;">　（未选：${p.other}）</span>
    </div>`
  ).join('');

  return `<p style="font-weight:600;color:var(--text);">一、你为什么这样选——选择倾向的深层含义</p>
  <p>Payne等人（1993）的决策研究表明，在"二选一"的快速选择中，理性分析往往让位于更深层的需求驱动。Kahneman（2011）在双系统理论中也指出：这种"不假思索"的选择，来自"系统1"（快速直觉系统），它比你的理性更早知道你真正需要什么。所以——你刚才的每一次选择，都不是随机的，是你的内心在替你说出那些还没说出口的话。</p>
  <p style="margin-top:8px;"><strong>选择倾向：${direction}</strong><br>${directionDesc[direction] || directionDesc['平衡中性']}</p>

  <p style="font-weight:600;color:var(--text);margin-top:14px;">二、你如何寻求安慰——依恋维度的投射</p>
  <p>${comfortInsight}</p>

  <p style="font-weight:600;color:var(--text);margin-top:14px;">三、你的感官世界——身体比大脑更早知道</p>
  <p>${sensoryInsights.join(' ')}</p>

  <p style="font-weight:600;color:var(--text);margin-top:14px;">四、独处还是联结——关系性需要的信号</p>
  <p>${relationalInsight}</p>

  <p style="font-weight:600;color:var(--text);margin-top:14px;">五、休息还是行动——能量状态的晴雨表</p>
  <p>${energyInsight}</p>
  ${comboInsight}

  <p style="font-weight:600;color:var(--text);margin-top:14px;">六、你的完整选择记录</p>
  <div style="background:#f8f9fb;padding:12px;border-radius:10px;margin-top:6px;">${choicesHTML}</div>

  <p style="font-weight:600;color:var(--text);margin-top:14px;">七、温柔的提醒</p>
  <p>Schwartz（2004）在《选择的悖论》中指出：选择从来不只是"选了什么"，更是"选择本身揭示了你是谁"。你刚才的每一次点击，都是内心深处某种需要在举手——Deci & Ryan（2000）说，满足需要的第一步是看见需要。你已经看见了。以上分析不是诊断，而是对你选择模式的整理与回响。你此刻的状态没有"对错"，只有"是什么"——而"是什么"本身就值得被温柔对待。</p>${ref}`;
}

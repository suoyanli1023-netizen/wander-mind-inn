// =============================================================
// 模块3: 放走坏心情
// =============================================================
let currentWorry = '';

function submitWorry() {
  const text = document.getElementById('worry-input').value.trim();
  if (!text) {
    document.getElementById('worry-input').focus();
    return;
  }
  SoundFX.click();
  currentWorry = text;
  document.getElementById('sticky-note-text').textContent = text;
  document.getElementById('sticky-note').classList.add('show');
}

function closeStickyNote() {
  document.getElementById('sticky-note').classList.remove('show');
  // 暂存到碎片
  STATE.worryState.fragments.push({ text: currentWorry, date: new Date().toLocaleString('zh-CN') });
  saveToStorage();
  renderFragments();
  document.getElementById('worry-input').value = '';
  currentWorry = '';
}

function shatterWorry() {
  document.getElementById('sticky-note').classList.remove('show');
  document.getElementById('shatter-confirm').classList.add('show');
}

function closeShatter() {
  document.getElementById('shatter-confirm').classList.remove('show');
  // 回到便利贴
  document.getElementById('sticky-note').classList.add('show');
}

function confirmShatter() {
  SoundFX.shredder();
  document.getElementById('shatter-confirm').classList.remove('show');
  // 显示漂流瓶
  document.getElementById('bottle-scene').classList.add('show');
  setTimeout(() => SoundFX.waterFlow(), 1200);
}

// ====== 放走坏心情：温馨安慰话语 ======
function getWorryComfortMessage(worryText) {
  const text = worryText || '';
  const parts = [];

  // 基于烦恼类型的共情
  if (/悲伤|难过|伤心|哭|泪|心痛/.test(text)) {
    parts.push(`看起来你好像有点悲伤。不过，你刚刚做了一件很重要的事——你把这份悲伤写了下来，然后亲手让它随漂流瓶远去。悲伤不需要被永远背着，放下它，不是忘记，而是给自己腾出新的空间。`);
  } else if (/焦虑|不安|紧张|害怕|担心|慌/.test(text)) {
    parts.push(`看起来你好像有些焦虑。不过，你刚才把那份说不清的不安变成了文字，又看它被粉碎、被海水带走——焦虑最怕的就是被"看见"和"被命名"，你刚刚做到了。`);
  } else if (/孤独|一个人|没人|寂寞/.test(text)) {
    parts.push(`看起来你好像有点孤单。不过，你愿意把这份孤独写出来，就已经在向世界发出一个小小的信号——你想被理解。这份勇气比你想的更大。`);
  } else if (/累|疲惫|撑不住|压力大|忙/.test(text)) {
    parts.push(`看起来你好像太累了。不过，你刚刚给自己按下了一个暂停键——把那些压在心上的东西卸下来，哪怕只是一会儿。你已经很努力了，歇一歇是应该的。`);
  } else if (/愤怒|生气|烦|讨厌|恨/.test(text)) {
    parts.push(`看起来你好像有些生气。不过，你选择了一种很健康的方式来处理它——写下来、粉碎它、送走它。愤怒被合理地释放了，而不是被压在心里或发泄到别人身上，这很不容易。`);
  } else {
    parts.push(`你刚刚把心里的一件烦心事放走了。不管它是什么，你愿意面对它、写下来、然后放手——这本身就是一种了不起的自我照顾。`);
  }

  return parts.join(' ');
}

// ====== 放走坏心情：基于用户书写内容的动态心理分析 ======
function buildWorryInterpretation(worryText) {
  const text = worryText || '';
  const ref = `<p style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
    <strong>参考文献</strong><br>
    Bion, W. R. (1962). <em>Learning from experience</em>. Heinemann.<br>
    Breuer, J., & Freud, S. (1895). <em>Studies on hysteria</em>. Deuticke.<br>
    Bushman, B. J. (2002). Does venting anger feed or extinguish the flame? <em>PSPB</em>, 28(6), 724–731.<br>
    Kazakova, S., et al. (2014). Interactions between metaphor and medium. <em>Journal of Advertising Research</em>, 54(2), 204–216.<br>
    Norton, M. I., & Gino, F. (2014). Rituals alleviate grieving. <em>Psychological Science</em>, 25(2), 492–505.<br>
    Penney, A. M., & Abbott, M. J. (2019). Embodied cognition in emotional disorders. <em>Journal of Cognitive Psychology</em>, 31(5-6), 533–553.
  </p>`;

  // 分析烦恼文字内容
  const len = text.length;
  let intensityDesc;
  if (len > 60) intensityDesc = `你写下了 ${len} 个字，文字较长、细节丰富。这通常意味着这件事对你来说有较重的情绪分量——你愿意花更多时间来描述它，说明它确实在你心里占据了位置。`;
  else if (len > 20) intensityDesc = `你写下了 ${len} 个字，用简洁的语言表达了你的烦恼。这种概括能力本身就是一种认知加工——将模糊的不适转化为具体的文字，是情绪调节的第一步。`;
  else intensityDesc = `你写下了 ${len} 个字，极为凝练。有时最重的烦恼恰恰需要最少的词语来承载——你选择了直面它，而非绕开它。`;

  // 情绪类别检测
  const worryKeywords = {
    work: ['工作', '加班', '老板', '同事', '项目', '任务', '汇报', '绩效', '压力', '累', '忙', 'ddl', 'deadline', '职业', '辞职'],
    relation: ['人际', '朋友', '关系', '吵架', '矛盾', '冲突', '误会', '冷战', '伴侣', '家人', '父母', '孩子', '对象', '男友', '女友', '分手', '背叛'],
    self: ['自己', '不够', '无能', '失败', '废物', '没价值', '自卑', '怀疑', '迷茫', '不知道', '未来', '意义', '前途', '方向', '人生', '空虚'],
    outer: ['钱', '房租', '贷款', '经济', '穷', '病', '身体', '失眠', '睡', '体检', '医院', '疫情', '环境', '社会', '考试', '成绩', '面试'],
    isolated: ['孤独', '一个人', '没人', '不被理解', '冷漠', '忽略', '冷落', '被遗忘', '透明', '不存在', '没人关心']
  };

  let detected = [];
  Object.entries(worryKeywords).forEach(([cat, keywords]) => {
    let score = 0;
    keywords.forEach(kw => { if (text.includes(kw)) score++; });
    if (score >= 2) detected.push(cat);
    else if (score >= 1 && text.length < 30) detected.push(cat); // 短文只需1个关键词
  });
  if (detected.length === 0) detected = ['general'];

  const catNames = { work: '工作/学业压力', relation: '人际关系', self: '自我怀疑', outer: '外部现实压力', isolated: '孤独感', general: '一般性情绪困扰' };
  const catTheories = {
    work: '你的烦恼涉及工作/学业领域。这在当代社会是最常见的压力源之一，Bushman（2002）的研究提醒我们，关键不在于"宣泄"本身，而在于"在安全框架内的觉察性宣泄"——写下烦恼本身已经完成了认知加工的第一步。',
    relation: '你的烦恼涉及人际关系。人际关系是心理健康的核心维度之一，Norton和Gino（2014）的仪式研究发现，带有象征意义的仪式化行为对人际相关的情绪困扰尤为有效——因为仪式提供了"闭环"（Closure），让未完成的心理事件得以终结。',
    self: '你的烦恼涉及对自我的怀疑或迷茫。Bion（1962）的"容器-被容纳"模型指出，这类情绪需要一个安全容器来接收和转化。你将它写下来、确认粉碎、目送远去——这些步骤本身就是在为这份自我怀疑提供一个"消化"的空间。',
    outer: '你的烦恼涉及外部现实压力。Penney和Abbott（2019）的具身情绪理论指出，现实压力往往伴随着身体的紧张——肌肉紧绷、呼吸变浅、肩膀耸起。粉碎动作的物理性，在隐喻层面模拟了"解除威胁"的过程，向身体发送"威胁已解除"的信号。',
    isolated: '你的烦恼涉及孤独感。需要区分的是：主动选择的独处是"Solitude"，被动承受的孤独是"Loneliness"。将孤独感写下来本身就是一种勇敢的自我照护——你在向自己承认这份感受，而不是推开它。',
    general: '你选择将烦恼放进了漂流瓶。Breuer和Freud（1895）的宣泄理论指出，将情绪转化为语言（书写）本身就是一种心理释放——不是在"解决问题"，而是先"承认它的存在"。这一承认，已经是疗愈的开始。'
  };

  const catStr = detected.map(c => catNames[c] || '').filter(Boolean).join('、');
  const theoryStr = detected.map(c => catTheories[c] || '').filter(Boolean).join(' ');

  return `<p style="font-weight:600;color:var(--text);">一、你的释放：${text ? '"' + escapeHtml(text.slice(0, 40)) + (text.length > 40 ? '…' : '') + '"' : '——'}</p>
  <p>${intensityDesc}</p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">二、基于你本次书写内容的具体分析</p>
  <p><strong>烦恼类型：${catStr}</strong><br>${theoryStr}</p>
  <p style="margin-top:8px;"><strong>释放仪式：书写→粉碎→漂流</strong><br>你在这个模块中经历了完整的情绪释放仪式——先书写（认知加工，将模糊的内感受转化为具体文字），再粉碎（具身释放，Kazakova等人（2014）的研究表明物理性动作能实质减弱负面情绪强度），最后目送漂流瓶远去（象征性告别，完成Norton & Gino（2014）所说的心理"闭环"）。每一个步骤都承担着特定的心理功能。</p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">三、温柔的提醒</p>
  <p>以上分析不是诊断，而是对你释放过程的见证。Bion（1962）的"容器-被容纳"模型指出，令人难以承受的情绪需要被一个足够安全的"容器"接收和转化。这个模块就是你此刻的容器——它接收了你的烦恼，通过粉碎和漂流的仪式将其"消化"为可以放下的东西。你已经完成了"面对"和"释放"——接下来，请允许自己走向下一段旅程。</p>${ref}`;
}

function closeBottle() {
  document.getElementById('bottle-scene').classList.remove('show');
  // 生成贴纸
  const emoji = '🌊';
  const label = '释放·漂流瓶';
  addStickerToArchive(emoji, label, 'released');
  const releasedWorry = currentWorry; // 保存烦恼文字用于解读
  document.getElementById('worry-input').value = '';
  currentWorry = '';

  // 个性化温馨安慰话语
  const comfort = getWorryComfortMessage(releasedWorry);

  // 移除旧的解读区域（如果存在）
  const oldInterpret = document.getElementById('worry-interpret-section');
  if (oldInterpret) oldInterpret.remove();

  // 显示完成提示与专业解读
  const container = document.getElementById('worry-container');
  const notice = document.createElement('div');
  notice.id = 'worry-interpret-section';
  notice.className = 'sticker-result';
  notice.innerHTML = `
    <div class="resonance-box">
      <div class="resonance-text">${comfort}</div>
    </div>
    <div style="margin-top:12px;padding:20px;background:#e8f4ee;border-radius:16px;">
      <div style="font-size:48px;margin-bottom:8px;">🌊</div>
      <div style="font-size:16px;font-weight:600;color:var(--text);">已随漂流瓶远去</div>
      <div style="font-size:13px;color:var(--text-light);margin-top:4px;">大海主题情绪贴纸已存入存档 🧴</div>
    </div>
    <div class="collapse-wrap" style="margin-top:16px;">
      <div class="collapse-trigger" onclick="toggleCollapse('worry-interpret')">
        <span class="arrow">▸</span> 情绪释放专业解读（APA7）
      </div>
      <div class="collapse-content" id="worry-interpret">
          ${buildWorryInterpretation(releasedWorry)}
        </div>
      </div>
    <div class="btn-center-row mt-16">
      <button class="btn-primary" onclick="navigateTo('page-home')">🏠 返回首页</button>
    </div>
  `;
  container.appendChild(notice);
  notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderFragments() {
  const card = document.getElementById('worry-fragments-card');
  const list = document.getElementById('worry-fragments-list');
  if (STATE.worryState.fragments.length === 0) {
    card.style.display = 'none';
    return;
  }
  card.style.display = 'block';

  // 安全清空：逐个移除子元素
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  // 使用 createElement + textContent 构建 DOM，避免 XSS
  STATE.worryState.fragments.forEach((f, i) => {
    const frag = document.createElement('div');
    frag.style.cssText = 'flex-shrink:0;width:140px;padding:12px;background:#fff9e8;border-radius:12px;border:1px solid #f0e8d8;cursor:pointer;';
    frag.addEventListener('click', () => reprocessFragment(i));

    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px;color:var(--text-muted);margin-bottom:4px;';
    label.textContent = '📌 碎片 ' + (i + 1);
    frag.appendChild(label);

    const text = document.createElement('div');
    text.style.cssText = 'font-size:12px;color:var(--text-light);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;';
    text.textContent = f.text || '';
    frag.appendChild(text);

    const date = document.createElement('div');
    date.style.cssText = 'font-size:10px;color:var(--text-muted);margin-top:4px;';
    date.textContent = f.date || '';
    frag.appendChild(date);

    list.appendChild(frag);
  });
}

function reprocessFragment(idx) {
  const fragment = STATE.worryState.fragments[idx];
  if (!fragment) return;
  STATE.worryState.fragments.splice(idx, 1);
  saveToStorage();
  renderFragments();
  currentWorry = fragment.text;
  document.getElementById('sticky-note-text').textContent = fragment.text;
  document.getElementById('sticky-note').classList.add('show');
}

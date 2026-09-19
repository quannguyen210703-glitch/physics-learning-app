const formatNumber = (value) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))).replace('.', ',');

const rotateOptions = (answer, distractors, correctIndex, unit) => {
  const values = [answer, ...distractors].map((value) => `${formatNumber(value)} ${unit}`);
  const options = values.map((text, index) => ({ id: String.fromCharCode(65 + ((index + correctIndex) % 4)), text }));
  return { options, correctAnswer: String.fromCharCode(65 + correctIndex) };
};

const makeNumericQuestion = ({ id, chapter, topic, concept, skill, difficulty, question, answer, distractors, unit, formula, explanation, solutionSteps, prerequisites, tags, sourceId, patternKey, similarTo }) => {
  const correctIndex = Number(id.match(/(\d+)$/)?.[1] ?? 1) % 4;
  const { options, correctAnswer } = rotateOptions(answer, distractors, correctIndex, unit);
  return {
    id, subject: 'physics', grade: 10, chapter, topic, concept, skill, difficulty, questionType: 'multiple_choice', question,
    options, correctAnswer, explanation, solutionSteps, formula,
    commonErrors: ['wrong_formula', 'calculation_error'], prerequisites, tags,
    sourceType: 'generated', sourceId, variantOf: null, similarTo, verified: true,
    numericAnswer: { value: answer, unit }, patternKey
  };
};

const speedWordings = [
  (s, t) => `Một xe đạp đi được ${s} m trong ${t} s. Tốc độ trung bình của xe là bao nhiêu?`,
  (s, t) => `Một robot di chuyển ${s} m trong ${t} s theo đường thẳng. Độ lớn vận tốc trung bình là bao nhiêu?`,
  (s, t) => `Một vận động viên chạy quãng đường ${s} m hết ${t} s. Tốc độ trung bình bằng bao nhiêu?`,
  (s, t) => `Trong ${t} s, một xe điện đi được ${s} m. Giá trị tốc độ trung bình là bao nhiêu?`
];
const accelerationWordings = [
  (v0, v, t) => `Vận tốc của xe tăng từ ${v0} m/s lên ${v} m/s trong ${t} s. Gia tốc trung bình là bao nhiêu?`,
  (v0, v, t) => `Một vật có vận tốc ban đầu ${v0} m/s và đạt ${v} m/s sau ${t} s. Tính gia tốc của vật.`,
  (v0, v, t) => `Sau ${t} s, vận tốc của tàu thay đổi từ ${v0} m/s thành ${v} m/s. Gia tốc là bao nhiêu?`,
  (v0, v, t) => `Xe bắt đầu với vận tốc ${v0} m/s và tăng lên ${v} m/s trong ${t} s. Giá trị gia tốc bằng bao nhiêu?`
];
const forceWordings = [
  (m, a) => `Một vật khối lượng ${m} kg chịu gia tốc ${a} m/s². Hợp lực tác dụng lên vật bằng bao nhiêu?`,
  (m, a) => `Muốn làm vật ${m} kg chuyển động với gia tốc ${a} m/s², cần hợp lực bao nhiêu?`,
  (m, a) => `Một xe có khối lượng ${m} kg và gia tốc ${a} m/s². Theo định luật II Newton, lực tổng hợp là bao nhiêu?`,
  (m, a) => `Vật ${m} kg chuyển động với gia tốc ${a} m/s² dưới tác dụng của hợp lực. Tính lực đó.`
];

const generatedQuestions = [];
for (let i = 1; i <= 24; i += 1) {
  const s = (i + 3) * 30, t = 2 + (i % 6), answer = Number((s / t).toFixed(2));
  generatedQuestions.push(makeNumericQuestion({
    id: `PHY10-KIN-VEL-G${String(i).padStart(3, '0')}`, chapter: 'dong-hoc', topic: 'chuyen-dong-thang', concept: 'van-toc', skill: 'tinh-van-toc', difficulty: 1 + (i % 4),
    question: speedWordings[(i - 1) % speedWordings.length](s, t), answer, distractors: [answer * 2, Number((answer / 2).toFixed(2)), Number((s / (t * 2)).toFixed(2))], unit: 'm/s', formula: 'v = s / t',
    explanation: `Tốc độ trung bình bằng quãng đường chia cho thời gian: ${s} / ${t} = ${formatNumber(answer)} m/s.`, solutionSteps: [`Đổi và xác định s = ${s} m, t = ${t} s.`, 'Dùng công thức v = s/t.', `Tính được v = ${formatNumber(answer)} m/s.`], prerequisites: ['distance', 'time'], tags: ['velocity', 'kinematics'], sourceId: 'codex-generated-2026-09-20', patternKey: 'average-speed', similarTo: ['PHY10-KIN-VEL-001']
  }));
}

for (let i = 1; i <= 24; i += 1) {
  const v0 = 2 + (i % 7), deltaV = 4 + ((i % 5) * 2), v = v0 + deltaV, t = 2 + (i % 4), answer = Number((deltaV / t).toFixed(2));
  generatedQuestions.push(makeNumericQuestion({
    id: `PHY10-KIN-ACC-G${String(i).padStart(3, '0')}`, chapter: 'dong-hoc', topic: 'chuyen-dong-thang', concept: 'gia-toc', skill: 'tinh-gia-toc', difficulty: 1 + (i % 4),
    question: accelerationWordings[(i - 1) % accelerationWordings.length](v0, v, t), answer, distractors: [deltaV, Number((v / t).toFixed(2)), Number((v0 / t).toFixed(2))], unit: 'm/s²', formula: 'a = (v - v₀) / t',
    explanation: `Gia tốc là độ biến thiên vận tốc chia cho thời gian: (${v} - ${v0}) / ${t} = ${formatNumber(answer)} m/s².`, solutionSteps: [`Xác định v₀ = ${v0} m/s và v = ${v} m/s.`, 'Tính Δv = v - v₀.', `Chia Δv cho t = ${t} s để được ${formatNumber(answer)} m/s².`], prerequisites: ['velocity', 'time'], tags: ['acceleration', 'kinematics'], sourceId: 'codex-generated-2026-09-20', patternKey: 'constant-acceleration', similarTo: ['PHY10-KIN-ACC-001']
  }));
}

for (let i = 1; i <= 24; i += 1) {
  const mass = 2 + (i % 7), acceleration = 1 + (i % 5), answer = mass * acceleration;
  generatedQuestions.push(makeNumericQuestion({
    id: `PHY10-DYN-NEW-G${String(i).padStart(3, '0')}`, chapter: 'dong-luc-hoc', topic: 'dinh-luat-newton', concept: 'luc-va-gia-toc', skill: 'ap-dung-dinh-luat-ii-newton', difficulty: 1 + (i % 4),
    question: forceWordings[(i - 1) % forceWordings.length](mass, acceleration), answer, distractors: [mass + acceleration, Number((mass / acceleration).toFixed(2)), mass * acceleration * 2], unit: 'N', formula: 'F = m a',
    explanation: `Theo định luật II Newton, F = ma = ${mass} × ${acceleration} = ${formatNumber(answer)} N.`, solutionSteps: [`Xác định m = ${mass} kg và a = ${acceleration} m/s².`, 'Áp dụng F = ma.', `Tính được F = ${formatNumber(answer)} N.`], prerequisites: ['mass', 'acceleration'], tags: ['newton', 'dynamics', 'force'], sourceId: 'codex-generated-2026-09-20', patternKey: 'newton-second-law', similarTo: ['PHY10-DYN-NEW-001']
  }));
}

for (let i = 1; i <= 24; i += 1) {
  const mass = 1 + (i % 7), value = 2 + (i % 6), kinetic = i % 2 === 1, answer = kinetic ? Number((0.5 * mass * value * value).toFixed(2)) : mass * 10 * value;
  const question = kinetic
    ? `Một vật khối lượng ${mass} kg chuyển động với tốc độ ${value} m/s. Động năng của vật là bao nhiêu?`
    : `Một vật khối lượng ${mass} kg ở độ cao ${value} m so với mốc thế năng. Lấy g = 10 m/s². Thế năng trọng trường là bao nhiêu?`;
  generatedQuestions.push(makeNumericQuestion({
    id: `PHY10-ENE-CON-G${String(i).padStart(3, '0')}`, chapter: 'nang-luong', topic: 'bao-toan-co-nang', concept: 'co-nang', skill: 'bao-toan-co-nang', difficulty: 1 + (i % 4), question, answer,
    distractors: [answer * 2, Number((answer / 2).toFixed(2)), Number((answer + i).toFixed(2))], unit: 'J', formula: kinetic ? 'Wđ = 1/2 m v²' : 'Wt = m g h',
    explanation: kinetic ? `Động năng Wđ = 1/2 × ${mass} × ${value}² = ${formatNumber(answer)} J.` : `Thế năng Wt = mgh = ${mass} × 10 × ${value} = ${formatNumber(answer)} J.`,
    solutionSteps: kinetic ? [`Xác định m = ${mass} kg, v = ${value} m/s.`, 'Áp dụng Wđ = 1/2mv².', `Tính được Wđ = ${formatNumber(answer)} J.`] : [`Xác định m = ${mass} kg, h = ${value} m và g = 10 m/s².`, 'Áp dụng Wt = mgh.', `Tính được Wt = ${formatNumber(answer)} J.`], prerequisites: ['mass', kinetic ? 'velocity' : 'height', 'energy'], tags: ['energy', kinetic ? 'kinetic-energy' : 'potential-energy'], sourceId: 'codex-generated-2026-09-20', patternKey: kinetic ? 'kinetic-energy' : 'gravitational-potential-energy', similarTo: []
  }));
}

export { generatedQuestions };

const searchableFields = ['id', 'question', 'concept', 'skill', 'tags'];

const addToIndex = (map, value, question) => {
  if (!value) return;
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    const key = String(item).toLowerCase();
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(question.id);
  }
};

const intersect = (left, right) => new Set([...left].filter((id) => right.has(id)));

export function buildQuestionIndex(questions) {
  const byId = new Map(), fields = Object.fromEntries(['chapter', 'topic', 'concept', 'skill', 'difficulty', 'tags'].map((key) => [key, new Map()]));
  const search = new Map();
  for (const question of questions) {
    byId.set(question.id, question);
    for (const key of Object.keys(fields)) addToIndex(fields[key], question[key], question);
    for (const field of searchableFields) {
      const raw = Array.isArray(question[field]) ? question[field].join(' ') : question[field];
      for (const token of String(raw ?? '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)) addToIndex(search, token, question);
    }
  }
  return Object.freeze({
    byId, byChapter: fields.chapter, byTopic: fields.topic, byConcept: fields.concept, bySkill: fields.skill, byDifficulty: fields.difficulty, byTag: fields.tags, search,
    query({ searchText = '', chapter = '', topic = '', concept = '', skill = '', difficulty = '' } = {}) {
      let ids = new Set(byId.keys());
      for (const [map, value] of [[fields.chapter, chapter], [fields.topic, topic], [fields.concept, concept], [fields.skill, skill], [fields.difficulty, difficulty]]) if (value !== '' && value !== undefined) ids = intersect(ids, map.get(String(value).toLowerCase()) ?? new Set());
      for (const token of String(searchText).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)) ids = intersect(ids, search.get(token) ?? new Set());
      return [...ids].map((id) => byId.get(id));
    }
  });
}

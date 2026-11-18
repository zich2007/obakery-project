const ALLOWED_MODEL = 'gemini-3.5-flash-lite';
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 750 * 1024;
const MAX_TOTAL_BYTES = 3 * 1024 * 1024;

const ingredientSchema = {
  type: 'OBJECT',
  properties: {
    ingredients: { type: 'ARRAY', items: { type: 'OBJECT', properties: {
      name: { type: 'STRING' }, grams: { type: 'NUMBER', nullable: true },
      kind: { type: 'STRING', enum: ['flour', 'other', 'unknown'] },
      usage: { type: 'STRING', enum: ['dough', 'topping', 'unknown'] },
      sourceText: { type: 'STRING' }, needsReview: { type: 'BOOLEAN' }, reason: { type: 'STRING' }
    }, required: ['name','grams','kind','usage','sourceText','needsReview','reason'] } },
    warnings: { type: 'ARRAY', items: { type: 'STRING' } },
    unreadableItems: { type: 'ARRAY', items: { type: 'STRING' } }
  }, required: ['ingredients','warnings','unreadableItems']
};

const processSchema = {
  type: 'OBJECT',
  properties: {
    stages: { type: 'ARRAY', items: { type: 'OBJECT', properties: {
      title: { type: 'STRING' }, detail: { type: 'STRING' },
      temperature: { type: 'STRING' }, time: { type: 'STRING' },
      point: { type: 'STRING' }, sourceText: { type: 'STRING' },
      needsReview: { type: 'BOOLEAN' }, reason: { type: 'STRING' }
    }, required: ['title','detail','temperature','time','point','sourceText','needsReview','reason'] } },
    warnings: { type: 'ARRAY', items: { type: 'STRING' } },
    unreadableItems: { type: 'ARRAY', items: { type: 'STRING' } }
  }, required: ['stages','warnings','unreadableItems']
};

function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
  const origin = req.headers.origin || '';
  if (allowedOrigin && origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'POST 요청만 허용됩니다.' });
  if (allowedOrigin && origin !== allowedOrigin) return send(res, 403, { error: '허용되지 않은 웹사이트에서 요청했습니다.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return send(res, 503, { error: '서버에 GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' });
  try {
    const body = req.body || {};
    if (body.consent !== true) return send(res, 400, { error: '사진 전송 동의가 확인되지 않았습니다.' });
    if (!['ingredients','process'].includes(body.type)) return send(res, 400, { error: '분석 유형이 올바르지 않습니다.' });
    if (!Array.isArray(body.images) || body.images.length < 1 || body.images.length > MAX_IMAGES) {
      return send(res, 400, { error: `사진은 1~${MAX_IMAGES}장까지 선택할 수 있습니다.` });
    }
    let totalBytes = 0;
    const imageParts = [];
    for (const image of body.images) {
      if (!image || !['image/jpeg','image/png','image/webp'].includes(image.mimeType) || typeof image.data !== 'string') {
        return send(res, 400, { error: 'JPG, PNG, WEBP 형식의 사진만 지원합니다.' });
      }
      const bytes = Buffer.from(image.data, 'base64');
      if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return send(res, 413, { error: '사진 한 장의 처리 크기는 750KB 이하여야 합니다.' });
      totalBytes += bytes.length;
      imageParts.push({ inline_data: { mime_type: image.mimeType, data: image.data } });
    }
    if (totalBytes > MAX_TOTAL_BYTES) return send(res, 413, { error: '사진 전체 용량이 제한을 초과했습니다. 사진 수를 줄여 다시 시도해 주세요.' });

    const isIngredients = body.type === 'ingredients';
    const prompt = isIngredients
      ? `당신은 제과제빵 실습 재료표 판독 도우미입니다. 첨부 사진의 표와 글자를 읽고 JSON 스키마에 맞게 추출하세요. 규칙: 사진에 실제로 보이는 재료만 기록합니다. 숫자/단위가 불분명하면 grams는 null로 둡니다. g는 숫자 그램으로, kg는 그램으로 환산합니다. 밀가루 종류(강력분/중력분/박력분 등)는 kind=flour, 일반 재료는 other, 확실하지 않으면 unknown. 반죽 재료는 usage=dough, 토핑/충전물/필링 재료는 usage=topping, 분류가 불명확하면 unknown. 재료명과 중량의 원문을 sourceText에 남깁니다. 추측으로 누락된 수치를 채우지 않습니다. 읽기 어려운 항목은 unreadableItems와 warnings에 설명합니다. needsReview는 불확실하거나 사람이 확인해야 하는 항목이면 true입니다.`
      : `당신은 제과제빵 실습 제조공정표 판독 도우미입니다. 첨부 사진의 공정표와 지시사항을 읽고 JSON 스키마에 맞게 추출하세요. 규칙: 사진에 실제로 보이는 내용만 기록합니다. 공정명은 title, 작업 설명은 detail, 온도/조건은 temperature, 시간은 time, 주의사항은 point에 기록합니다. 사진에 없는 온도·시간·설명은 절대 추측하지 말고 빈 문자열로 둡니다. 여러 단계가 있으면 원래 순서를 유지합니다. 각 단계의 근거 문구를 sourceText에 남깁니다. 불명확하거나 잘린 내용은 needsReview=true로 표시하고 reason에 이유를 씁니다. 판독할 수 없는 내용은 unreadableItems와 warnings에 기록합니다.`;

    const schema = isIngredients ? ingredientSchema : processSchema;
    const parts = [{ text: prompt }, ...imageParts];
    const model = process.env.GEMINI_MODEL || ALLOWED_MODEL;
    if (model !== ALLOWED_MODEL) return send(res, 403, { error: '현재 버전은 무료 우선 모델 gemini-3.5-flash-lite만 허용합니다. Vercel의 GEMINI_MODEL 환경 변수를 확인해 주세요.' });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', responseJsonSchema: schema, temperature: 0.1 }
      }),
      signal: AbortSignal.timeout(55000)
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = result?.error?.message || 'Gemini API 요청에 실패했습니다.';
      const status = upstream.status === 429 ? 429 : upstream.status === 400 ? 400 : 502;
      return send(res, status, { error: upstream.status === 429 ? 'Gemini 무료 사용 한도 또는 요청 제한에 도달했습니다. 잠시 후 다시 시도하거나 기존 OCR을 이용해 주세요.' : message });
    }
    const text = result?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('');
    if (!text) return send(res, 502, { error: 'AI 응답에 분석 결과가 없습니다. 사진을 다시 촬영해 시도해 주세요.' });
    let parsed;
    try { parsed = JSON.parse(text); } catch { return send(res, 502, { error: 'AI 결과를 JSON으로 해석하지 못했습니다. 다시 시도해 주세요.' }); }
    return send(res, 200, { result: parsed, model, usage: result.usageMetadata || null });
  } catch (error) {
    const message = error.name === 'TimeoutError' ? 'AI 분석 시간이 초과되었습니다. 사진 수를 줄여 다시 시도해 주세요.' : '서버 처리 중 오류가 발생했습니다.';
    return send(res, 500, { error: message });
  }
};

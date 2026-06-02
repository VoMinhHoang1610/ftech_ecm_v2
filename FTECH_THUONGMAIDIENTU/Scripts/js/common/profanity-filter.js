(function () {
  const PROFANITY_WORDS = [
    { word: 'dm', severity: 'high' },
    { word: 'dmm', severity: 'high' },
    { word: 'dit', severity: 'high' },
    { word: 'du', severity: 'high' },
    { word: 'du ma', severity: 'high' },
    { word: 'duma', severity: 'high' },
    { word: 'con me', severity: 'high' },
    { word: 'me may', severity: 'high' },
    { word: 'cha may', severity: 'high' },
    { word: 'bo may', severity: 'high' },
    { word: 'lon', severity: 'high' },
    { word: 'buoi', severity: 'high' },
    { word: 'cu', severity: 'high' },
    { word: 'cuc cut', severity: 'medium' },
    { word: 'cai lon', severity: 'high' },
    { word: 'oc cho', severity: 'high' },
    { word: 'oc lon', severity: 'high' },
    { word: 'mat day', severity: 'medium' },
    { word: 'vo hoc', severity: 'medium' },
    { word: 'suc vat', severity: 'high' },
    { word: 'cho chet', severity: 'high' },
    { word: 'do ngu', severity: 'medium' },
    { word: 'ngu si', severity: 'medium' },
    { word: 'ngu ngoc', severity: 'medium' },
    { word: 'than kinh', severity: 'medium' },
    { word: 'dien khung', severity: 'medium' },
    { word: 'khon nan', severity: 'medium' },
    { word: 'de tien', severity: 'medium' },
    { word: 'rac ruoi', severity: 'medium' },
    { word: 'an hai', severity: 'medium' },
    { word: 'phe vat', severity: 'medium' },
    { word: 'do bo di', severity: 'medium' },
    { word: 'ghet may', severity: 'low' },
    { word: 'cut xeo', severity: 'medium' },
    { word: 'bien di', severity: 'low' },
    { word: 'cau xe', severity: 'medium' },
    { word: 'bam thiu', severity: 'medium' },
    { word: 'ham lon', severity: 'high' },
    { word: 'khung dien', severity: 'medium' },
    { word: 'thang cho', severity: 'high' },
    { word: 'con cho', severity: 'high' },
    { word: 'do cho', severity: 'high' },
    { word: 'cho de', severity: 'high' },
    { word: 'mat lon', severity: 'high' },
    { word: 'vai lon', severity: 'high' },
    { word: 'vl', severity: 'medium' },
    { word: 'vcl', severity: 'high' },
    { word: 'clm', severity: 'high' },
    { word: 'cc', severity: 'medium' },
    { word: 'cmm', severity: 'high' },
    { word: 'fuck', severity: 'high' },
    { word: 'fucking', severity: 'high' },
    { word: 'shit', severity: 'medium' },
    { word: 'bullshit', severity: 'medium' },
    { word: 'bitch', severity: 'high' },
    { word: 'bastard', severity: 'high' },
    { word: 'asshole', severity: 'high' },
    { word: 'dick', severity: 'high' },
    { word: 'cunt', severity: 'high' },
    { word: 'damn', severity: 'low' },
    { word: 'crap', severity: 'low' },
    { word: 'jerk', severity: 'medium' },
    { word: 'idiot', severity: 'medium' },
    { word: 'moron', severity: 'medium' },
    { word: 'stupid', severity: 'medium' },
    { word: 'dumb', severity: 'medium' },
    { word: 'trash', severity: 'low' },
    { word: 'loser', severity: 'medium' },
    { word: 'suck', severity: 'medium' },
    { word: 'sucks', severity: 'medium' },
    { word: 'freak', severity: 'medium' },
    { word: 'retard', severity: 'high' },
    { word: 'slut', severity: 'high' },
    { word: 'whore', severity: 'high' },
    { word: 'prick', severity: 'high' },
    { word: 'piss', severity: 'medium' },
    { word: 'kill yourself', severity: 'high' },
    { word: 'hate you', severity: 'medium' },
    { word: 'go die', severity: 'high' },
    { word: 'shut up', severity: 'low' }
  ];

  const LEET_MAP = {
    '@': 'a',
    '4': 'a',
    '0': 'o',
    '1': 'i',
    '!': 'i',
    '|': 'i',
    '3': 'e',
    '5': 's',
    '$': 's',
    '7': 't',
    '+': 't',
    '8': 'b'
  };

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[@401!|35$7+8]/g, char => LEET_MAP[char] || char)
      .replace(/[\[\]{}().,_\-*~`'"\\/:;]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compactText(value) {
    return normalizeText(value).replace(/\s+/g, '');
  }

  function uniqueMatches(matches) {
    const seen = new Set();
    return matches.filter(match => {
      const key = `${match.word}:${match.severity}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function checkProfanity(text) {
    const normalized = normalizeText(text);
    const compact = compactText(text);
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const matches = uniqueMatches(PROFANITY_WORDS.filter(item => {
      const word = normalizeText(item.word);
      const compactWord = word.replace(/\s+/g, '');
      if (compactWord.length <= 3) return tokens.includes(compactWord);
      return normalized.includes(word) || compact.includes(compactWord);
    }));

    return {
      hasProfanity: matches.length > 0,
      matches,
      suggestions: matches.length ? [
        'Hãy thay bằng mô tả trải nghiệm cụ thể về sản phẩm.',
        'Tập trung vào lỗi, hiệu năng, giá bán hoặc dịch vụ cần cải thiện.',
        'Xóa các từ công kích cá nhân trước khi gửi lại đánh giá.'
      ] : []
    };
  }

  window.FTECHProfanityFilter = {
    words: PROFANITY_WORDS,
    normalizeText,
    checkProfanity
  };
  window.checkProfanity = checkProfanity;
})();

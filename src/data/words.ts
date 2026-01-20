// Common English words for typing test - 500 words
export const wordList: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "was", "are", "been", "has", "had", "did", "does", "were", "being",
  "very", "when", "where", "why", "here", "more", "made", "find", "long", "own",
  "part", "down", "too", "still", "such", "should", "never", "world", "high", "life",
  "last", "right", "next", "mean", "start", "might", "begin", "same", "need", "must",
  "home", "move", "live", "school", "hand", "old", "great", "ask", "small", "try",
  "again", "tell", "follow", "put", "always", "under", "keep", "change", "turn", "help",
  "show", "off", "every", "play", "spell", "found", "study", "run", "point", "read",
  "form", "learn", "city", "place", "thing", "open", "stop", "child", "few", "seem",
  "build", "write", "three", "state", "name", "end", "walk", "call", "may", "grow",
  "close", "while", "house", "early", "page", "number", "left", "really", "later", "idea",
  "head", "stand", "word", "letter", "kind", "water", "start", "often", "side", "set",
  "light", "hard", "night", "country", "plant", "cover", "food", "face", "table", "once",
  "story", "land", "carry", "group", "cut", "paper", "music", "watch", "book", "tree",
  "family", "white", "line", "black", "mother", "father", "second", "color", "road", "sure",
  "best", "both", "order", "door", "heard", "body", "until", "mile", "between", "feet",
  "river", "enough", "almost", "along", "example", "four", "answer", "above", "girl", "boy",
  "young", "money", "different", "field", "though", "list", "half", "together", "sleep", "ever",
  "five", "front", "air", "fire", "care", "south", "west", "east", "north", "red",
  "top", "power", "voice", "blue", "friend", "during", "free", "class", "hold", "fish",
  "morning", "ground", "problem", "room", "love", "dark", "horse", "ship", "believe", "green",
  "true", "happen", "hear", "heart", "fall", "someone", "town", "quick", "fast", "slow",
  "rock", "mind", "idea", "plain", "nothing", "area", "figure", "speak", "reason", "eye",
  "strong", "remember", "base", "step", "early", "boat", "song", "leave", "machine", "simple",
  "less", "wait", "moon", "sun", "piece", "done", "knew", "measure", "busy", "unit",
  "across", "short", "special", "ready", "fact", "ago", "travel", "understand", "week", "behind",
  "warm", "note", "cold", "bring", "sat", "finish", "island", "question", "complete", "mark",
  "yet", "knew", "lay", "clear", "feel", "surface", "full", "hot", "pass", "gold",
  "contain", "fit", "language", "ago", "ran", "check", "game", "inch", "maybe", "rest",
  "result", "produce", "push", "test", "speed", "product", "fly", "miss", "record", "course",
  "brown", "window", "edge", "fine", "catch", "dog", "cat", "century", "store", "deep",
  "type", "wood", "main", "safe", "bird", "common", "whether", "drive", "stay", "round",
  "star", "minute", "hour", "table", "cross", "pick", "ball", "center", "fill", "pull",
  "happy", "reach", "listen", "touch", "draw", "huge", "wall", "market", "third", "price",
  "bit", "act", "require", "doctor", "direct", "force", "break", "plan", "interest", "art",
  "floor", "war", "history", "return", "deal", "effort", "wonder", "suddenly", "single", "rule",
  "month", "join", "present", "notice", "pair", "street", "huge", "yard", "beat", "clean",
  "dress", "lot", "image", "spring", "forward", "dry", "strange", "past", "term", "view",
  "toward", "section", "ocean", "design", "appear", "human", "modern", "sound", "chance", "season",
  "team", "serve", "arm", "future", "basic", "size", "space", "shape", "sort", "ten"
];

export const getRandomWords = (count: number): string[] => {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const generateTestText = (wordCount: number = 100): string => {
  return getRandomWords(wordCount).join(' ');
};

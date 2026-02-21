import quotesData from '../data/mongolian-quotes.json';

interface ParseDataParams {
  text: string;
  author: string;
}

interface ParseDataReturn {
  quote: string;
  author: string;
}

const parseData = (data: ParseDataParams): ParseDataReturn => {
  return {
    quote: data.text,
    author: data.author
  };
};

const randomQuote = (data: ParseDataParams[]): ParseDataParams => {
  const validQuotes = data.filter(
    quote => quote && typeof quote.text === 'string'
  );

  if (validQuotes.length === 0) {
    throw new Error('No valid quotes found in the data.');
  }

  let randQuote = validQuotes[Math.floor(Math.random() * validQuotes.length)];

  return randQuote.text.length < 220 ? randQuote : randomQuote(validQuotes);
};

export async function fetchQuotes(): Promise<ParseDataReturn> {
  const data: ParseDataParams[] = quotesData;

  if (!Array.isArray(data)) {
    throw new Error('Fetched data is not an array.');
  }

  let randQuote = randomQuote(data);

  return parseData(randQuote);
}

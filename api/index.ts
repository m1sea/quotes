import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchQuotes } from '../src/fetcher/fetch-quotes';
import { renderSVG } from '../src/renderer/render-svg';
import { themes } from '../src/renderer/theme/awesome-card';

import type { CardType } from '../src/renderer/render-svg';

interface ResponseQuery {
  type: CardType;
  theme: keyof typeof themes;
  quote: string;
  author: string;
  border: boolean;
  quoteColor?: string;
  authorColor?: string;
  backgroundColor?: string;
  symbolColor?: string;
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const {
    type,
    theme,
    quote,
    author,
    border,
    quoteColor,
    authorColor,
    backgroundColor,
    symbolColor
  } = req.query as unknown as ResponseQuery;

  let data;

  if (quote && author) {
    data = {
      quote: quote,
      author: author
    };
  } else if (quote) {
    data = {
      quote: quote,
      author: 'Me'
    };
  } else {
    data = await fetchQuotes();
  }

  const customColors = {
    quote: quoteColor,
    author: authorColor,
    background: backgroundColor,
    symbol: symbolColor
  };

  // Convert string 'false' from URL query to boolean false. Defaults to true.
  const isBorder = typeof border === 'string' ? border !== 'false' : border !== false;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(renderSVG(data, type, theme, isBorder, customColors));
};

export default handler;

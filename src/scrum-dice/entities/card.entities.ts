export type CardType = 'cost-type' | 'not-cost-type';
export type CardCostContent =
  | '0'
  | '0.5'
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '20'
  | '21'
  | '34'
  | '40'
  | '55'
  | '89'
  | '100';
export type CardNotCostContent = 'coffee' | 'question' | 'king' | 'break';
export type CardContent = CardCostContent | CardNotCostContent;
export type Card = { type: CardType; content: CardContent };
export type Cards = Record<string, Card>;

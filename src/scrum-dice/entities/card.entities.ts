export type Type = 'cost-type' | 'not-cost-type';
export type CostContent =
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
export type NotCostContent = 'coffee' | 'question' | 'king' | 'break';
export type Content = CostContent | NotCostContent;
export type Card = { type: Type; content: Content };
export type Cards = { [memberId: string]: Card };

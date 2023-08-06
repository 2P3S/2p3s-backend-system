export const types = ['cost-type', 'not-cost-type'] as const;
export type Type = (typeof types)[number];

export const costContents = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '21',
  '34',
  '40',
  '55',
  '89',
  '100',
] as const;
export type CostContent = (typeof costContents)[number];

export const notCostContents = ['coffee', 'question', 'king', 'break'] as const;
export type NotCostContent = (typeof notCostContents)[number];

export type Content = CostContent | NotCostContent;

export type Card = { type: Type; content: Content };
export type Cards = { [memberId: string]: Card };

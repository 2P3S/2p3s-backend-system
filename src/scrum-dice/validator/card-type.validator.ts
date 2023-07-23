export function isValidCardType(type: any): boolean {
  return type === 'cost-type' || type === 'not-cost-type';
}

export function isValidCardContent(content: any): boolean {
  return isValidCostContent(content) || isValidNotCostContent(content);
}

function isValidCostContent(content: any): boolean {
  return (
    content === '1' ||
    content === '2' ||
    content === '3' ||
    content === '5' ||
    content === '8' ||
    content === '13' ||
    content === '20' ||
    content === '40' ||
    content === '100'
  );
}

function isValidNotCostContent(content: any): boolean {
  return (
    content === 'coffee' ||
    content === 'question' ||
    content === 'infinity' ||
    content === 'break'
  );
}

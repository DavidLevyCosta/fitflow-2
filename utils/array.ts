export function calculateArrayAverage(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0; // Avoid division by zero if the array is empty
  }

  const sum = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  return sum / numbers.length;
}

export function sumArray(numbers: number[]): number { return numbers.reduce((acc, cv) => acc + cv, 0) }

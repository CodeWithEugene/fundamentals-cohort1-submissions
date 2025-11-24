export function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

export function heavyDataProcessing(data, iterations = 40) {
  console.log(`Starting heavy computation with ${iterations} iterations...`);
  
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random() * 1000,
    nested: {
      data: Array.from({ length: 10 }, (_, j) => j * i)
    }
  }));

  // CPU-intensive operations
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += fibonacciRecursive(20); // Very CPU-intensive
  }

  // Complex data transformation
  const processed = largeArray
    .filter(item => item.value > 500)
    .map(item => ({
      ...item,
      computed: item.value * result,
      fibonacci: fibonacciRecursive(20)
    }))
    .reduce((acc, item) => acc + item.computed, 0);

  return {
    result,
    processed,
    timestamp: Date.now(),
    dataPoints: largeArray.length,
    iterations
  };
}
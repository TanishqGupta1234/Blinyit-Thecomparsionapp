export function getComparisonPrices(basePrice) {
  return {
    blinkit: basePrice - 2,
    zepto: basePrice + 1,
    instamart: basePrice + 3,
  };
}

export function getDeliveryAndHandlingCharges(appName, seed = 0) {
  // Use the seed to generate a pseudo-random but consistent value for each item
  function pseudoRandom(min, max) {
    // Simple deterministic pseudo-random based on seed
    const x = Math.sin(seed + min + max) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  }

  switch (appName) {
    case "blinkit":
      return {
        delivery: 10 + pseudoRandom(0, 5), // 10-15
        handling: 2 + pseudoRandom(0, 3),  // 2-5
      };
    case "zepto":
      return {
        delivery: 12 + pseudoRandom(0, 5), // 12-17
        handling: 3 + pseudoRandom(0, 2),  // 3-5
      };
    case "instamart":
      return {
        delivery: 11 + pseudoRandom(0, 5), // 11-16
        handling: 2 + pseudoRandom(0, 3),  // 2-5
      };
    default:
      return { delivery: 0, handling: 0 };
  }
}
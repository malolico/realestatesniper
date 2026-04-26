function expectedClassification(score) {
  if (score >= 90) return "premium";
  if (score >= 70) return "red";
  if (score >= 50) return "green";
  return "yellow";
}

function expectedAccessTier(score) {
  if (score >= 70) return "premium";
  return "standard";
}

function assertDealConsistency(deal) {
  const errors = [];

  const expectedClass = expectedClassification(deal.score);
  const expectedTier = expectedAccessTier(deal.score);

  if (deal.classification !== expectedClass) {
    errors.push(
      `Expected classification "${expectedClass}" but got "${deal.classification}"`
    );
  }

  if (deal.access_tier !== expectedTier) {
    errors.push(
      `Expected access_tier "${expectedTier}" but got "${deal.access_tier}"`
    );
  }

  return errors;
}

function checkDealsConsistency(deals = []) {
  let totalErrors = 0;

  deals.forEach((deal, index) => {
    const errors = assertDealConsistency(deal);

    if (errors.length > 0) {
      totalErrors++;
      console.log(`❌ Deal inconsistency at index ${index}`);
      console.log(errors);
    }
  });

  console.log(`🧠 Consistency issues found: ${totalErrors}`);

  return totalErrors;
}

export { assertDealConsistency, checkDealsConsistency };
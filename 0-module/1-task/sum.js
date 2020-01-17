function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError();
  }

  return a + b;
}

function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

module.exports = sum;

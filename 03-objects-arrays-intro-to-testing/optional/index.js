export function returnTrue0(a) {
  return a;
}

export function returnTrue1(a) {
  return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
}

export function returnTrue2(a) {
  return a !== a;
}

export function returnTrue3(a, b, c) {
  return a && a == b && b == c && a != c;
}

export function returnTrue4(a) {
  return (a++ !== a) && (a++ === a);
}

export function returnTrue5(a) {
  return a in a;
}

export function returnTrue6(a) {
  return a[a] == a;
}

export function returnTrue7(a, b) {
  return a === b && 1 / a < 1 / b;
}

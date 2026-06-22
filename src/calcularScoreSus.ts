export function calcularScoreSus(respostas: Record<string, string>): number {
  const getVal = (id: string) => Number(respostas[id]) || 0;

  const impares = (getVal('use_frequency') - 1) +
                  (getVal('use_easy') - 1) +
                  (getVal('function_integration') - 1) +
                  (getVal('learning_curve') - 1) +
                  (getVal('confidence') - 1);

  const pares = (5 - getVal('use_complex')) +
                (5 - getVal('need_help')) +
                (5 - getVal('inconsistency')) +
                (5 - getVal('jumbled')) +
                (5 - getVal('learn_system'));

  return (impares + pares) * 2.5;
}

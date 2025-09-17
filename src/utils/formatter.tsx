export function formatCurrency(value) {
  // Se o valor não for um número, retorna ele mesmo ou um valor padrão.
  if (typeof value !== 'number') {
    return value;
  }

  // Cria o formatador para o real brasileiro (BRL)
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2, // Garante que sempre terá duas casas decimais
  });

  return formatter.format(value);
}
async function showProgressBar(totalItems: number) {
  const progressBarWidth = 50;
  let completedItems = 0;

  // Limpa a linha atual
  process.stdout.write('\x1B[2K');

  // Escreve o indicador de progresso inicial
  process.stdout.write('Progresso: [');

  async function updateProgressBar() {
    // Calcula a porcentagem concluída
    const percentage = Math.floor((completedItems / totalItems) * 100);

    // Calcula o número de caracteres preenchidos na barra de progresso
    const filledWidth = Math.floor((progressBarWidth * completedItems) / totalItems);

    // Calcula o número de caracteres vazios na barra de progresso
    const emptyWidth = progressBarWidth - filledWidth;

    // Escreve os caracteres preenchidos na barra de progresso
    process.stdout.write('='.repeat(filledWidth));

    // Escreve os caracteres vazios na barra de progresso
    process.stdout.write(' '.repeat(emptyWidth));

    // Escreve a porcentagem atual
    process.stdout.write(`] ${percentage}%`);

    // Move o cursor para a linha anterior
    process.stdout.write('\x1B[1A');

    // Move o cursor para a coluna inicial
    process.stdout.write('\x1B[0G');
  }

  // Atualiza a barra de progresso
  await updateProgressBar();

  // Simula algum processo com um loop
  for (let i = 0; i <= totalItems; i++) {
    // Simula algum processamento
    // Aqui você pode inserir a lógica do seu processo

    // Aguarda um pequeno intervalo de tempo
    // para simular o processamento
    // No seu caso, você pode remover essa linha
    // ou ajustar o tempo conforme necessário
    await new Promise(resolve => setTimeout(resolve, 50));

    // Atualiza o número de itens concluídos
    completedItems++;

    // Atualiza a barra de progresso
    updateProgressBar();
  }

  // Pula para a próxima linha após a conclusão do progresso
  process.stdout.write('\n');
}

// Exemplo de uso
const totalItems = 100;
showProgressBar(totalItems);
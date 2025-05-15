// Para Node 18+
// Se for Node <18, use node-fetch e ajuste conforme descrito acima.

async function streamChatMessage(question) {
  const response = await fetch('http://localhost:8090/v1/chat/message/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify({ question })),
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok || !response.body) {
    console.error('Error', response);
    console.error('Erro na requisição:', response.statusText);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullMessage;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    process.stdout.write(chunk); // Mostra no terminal
    fullMessage += chunk;
  }

  console.log('\n\n--- Mensagem completa ---');
  console.log(fullMessage);
}

// Executa a função com argumento do terminal
const question = process.argv[2] || 'Olá modelo';
streamChatMessage(question).catch(console.error);

// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Defina sua chave de API aqui (não exponha no código de produção!)
const apiKey = 'sua-api-key-aqui';

// Endpoint para enviar a mensagem à API OpenAI
app.post('/enviar-mensagem', async (req, res) => {
    const { mensagem } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: mensagem }
                ]
            })
        });

        const data = await response.json();
        const resposta = data.choices[0].message.content;

        res.json({ resposta });  // Retorna a resposta do bot
    } catch (error) {
        console.error('Erro ao enviar mensagem para a API OpenAI:', error);
        res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Função para lidar com o clique no botão de enviar
document.getElementById('send-message').addEventListener('click', () => {
    const userMessage = document.getElementById('user-message').value;
    if (userMessage.trim() !== '') {
        // Exibe a mensagem do usuário no chat
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `Você: ${userMessage}`;  // Exibe a mensagem do usuário
        chatMessages.appendChild(messageDiv);

        // Envia a mensagem para o servidor back-end
        fetch('http://localhost:3000/enviar-mensagem', {  // A URL do seu servidor
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensagem: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.resposta;

            // Exibe a resposta do ChatGPT no chat
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `ChatGPT: ${botResponse}`;
            chatMessages.appendChild(messageDiv);
        })
        .catch(error => {
            console.error('Erro ao comunicar com o servidor:', error);
        });

        // Limpa o campo de entrada de mensagem
        document.getElementById('user-message').value = '';
    }
});
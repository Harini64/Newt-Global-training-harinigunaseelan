import os
import requests
from flask import Flask, render_template_string, request, jsonify
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def search_web(query):
    """Search web using Tavily API"""
    try:
        api_key = os.getenv('TAVILY_API_KEY', '')
        if not api_key:
            print("TAVILY_API_KEY not found in environment")
            return []
        
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": api_key,
            "query": query,
            "search_depth": "basic",
            "include_answer": False,
            "include_raw_content": False,
            "max_results": 3
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            if 'results' in data:
                for result in data['results']:
                    results.append({
                        'title': result.get('title', ''),
                        'url': result.get('url', ''),
                        'snippet': result.get('content', '')
                    })
            
            print(f"Tavily search found {len(results)} results")
            return results
        else:
            print(f"Tavily API error: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Tavily search error: {e}")
        return []

def get_groq_response(message, history):
    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        
        # Always try web search for current information
        print(f"Debug: Searching web for: {message}")
        web_results = search_web(message)
        print(f"Debug: Found {len(web_results)} web results")
        
        messages = []
        for user_msg, assistant_msg in history:
            messages.append({"role": "user", "content": user_msg})
            if assistant_msg:
                messages.append({"role": "assistant", "content": assistant_msg})
        
        # Add web search results to context if available
        if web_results:
            search_context = "CURRENT WEB SEARCH RESULTS (use this for up-to-date information):\n"
            for i, result in enumerate(web_results, 1):
                search_context += f"{i}. Title: {result['title']}\n   Content: {result['snippet']}\n   URL: {result['url']}\n\n"
            
            # Get current date
            import datetime
            current_date = datetime.datetime.now().strftime("%B %d, %Y")
            
            messages.append({"role": "system", "content": f"IMPORTANT: Current date is {current_date}. The user is asking for current information. Use the web search results provided to give accurate, up-to-date answers. The web search results contain current information that may be more recent than your training data."})
            messages.append({"role": "user", "content": f"{search_context}\n\nQuestion: {message}"})
        else:
            messages.append({"role": "user", "content": message})
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
            top_p=1,
            stream=False
        )
        
        response = completion.choices[0].message.content
        
        return response
            
    except Exception as e:
        return f"Error: {str(e)}. Please check your API key and internet connection."

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Groq AI Chatbot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100vh; display: flex; justify-content: center; align-items: center; }
        .container { width: 90%; max-width: 800px; height: 80vh; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; text-align: center; }
        .header h1 { font-size: 2em; margin-bottom: 5px; }
        .header p { opacity: 0.9; }
        .chat-container { flex: 1; overflow-y: auto; padding: 20px; background: #f8f9fa; }
        .message { margin-bottom: 15px; display: flex; align-items: flex-start; }
        .user-message { justify-content: flex-end; }
        .message-content { max-width: 70%; padding: 12px 16px; border-radius: 18px; word-wrap: break-word; }
        .user-message .message-content { background: #007bff; color: white; border-bottom-right-radius: 5px; }
        .bot-message .message-content { background: white; border: 1px solid #e9ecef; border-bottom-left-radius: 5px; }
        .input-container { padding: 20px; background: white; border-top: 1px solid #e9ecef; display: flex; gap: 10px; }
        .message-input { flex: 1; padding: 12px 16px; border: 1px solid #ddd; border-radius: 25px; outline: none; font-size: 16px; }
        .send-btn { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        .send-btn:hover { background: #0056b3; }
        .send-btn:disabled { background: #ccc; cursor: not-allowed; }
        .clear-btn { padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; margin-left: 10px; }
        .clear-btn:hover { background: #c82333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AI Chatbot</h1>
            <p>Powered by Groq - Ask me anything!</p>
        </div>
        
        <div class="chat-container" id="chatContainer">
            <div class="message bot-message">
                <div class="message-content">
                    Hello! How can I help you today?
                </div>
            </div>
        </div>
        
        <div class="input-container">
            <input type="text" id="messageInput" class="message-input" placeholder="Type your message here..." onkeypress="handleKeyPress(event)">
            <button id="sendBtn" class="send-btn" onclick="sendMessage()">Send</button>
            <button class="clear-btn" onclick="clearChat()">Clear</button>
        </div>
    </div>

    <script>
        let conversationHistory = [];
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') sendMessage();
        }
        
        function addMessage(content, isUser = false) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = content;
            
            messageDiv.appendChild(messageContent);
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            addMessage(message, true);
            input.value = '';
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message, history: conversationHistory })
                });
                
                const data = await response.json();
                
                if (data.response) {
                    addMessage(data.response, false);
                    conversationHistory.push([message, data.response]);
                } else {
                    addMessage(data.error, false);
                }
            } catch (error) {
                addMessage('Error: Could not connect to the server. Please try again.', false);
            }
        }
        
        function clearChat() {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        Hello! I'm Groq AI. How can I help you today?
                    </div>
                </div>
            `;
            conversationHistory = [];
        }
        
        document.getElementById('messageInput').focus();
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        history = data.get('history', [])
        
        if not message:
            return jsonify({'error': 'No message provided'})
        
        response = get_groq_response(message, history)
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'})

if __name__ == '__main__':
    print("Chatbot starting...")    
    app.run(host='127.0.0.1', port=5000, debug=True)

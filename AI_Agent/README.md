### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up and create an API key
3. Copy your API key

### 3. Configure Environment

Create a `.env` file with your API key:

```
GROQ_API_KEY=your_grok_api_key_here
```

### 4. Run Application

```bash
python main.py
```

Open your browser and go to `http://127.0.0.1:5000`

## Project Structure

```
AI_Agent/
├── main.py              # Main Flask application
├── requirements.txt     # Python dependencies
├── .env               # API key configuration
└── README.md          # This file
```

## Dependencies

- **flask**: Web framework
- **groq**: Groq API client
- **python-dotenv**: Environment variable management

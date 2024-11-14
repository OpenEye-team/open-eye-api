import os
from flask import Flask, request, jsonify, session
from openai import AzureOpenAI
from collections import defaultdict

# Load environment variables or use default values
endpoint = "https://chat-peaky.openai.azure.com/"
deployment = "gpt-4o"
search_endpoint = "https://chatbotpeaky.search.windows.net"
search_key = "zs7XGfDRLYoiKjytcGpXT8NgvYlS8Q2CHMyMJ1MvnaAzSeDhqKhC"
search_index = "test"
subscription_key = "28KAxFusgBWquG5TE6goRhIKWzRgAgcJOwxfLCHZhtapYZj6j7N1JQQJ99AKACHYHv6XJ3w3AAAAACOGwB0Y"

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Replace with a real secret key in production

# Initialize Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2024-05-01-preview",
)

# Dictionary to store chat history for each session or user
user_histories = defaultdict(list)

# Define the chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    user_id = data.get("user_id")  # A unique identifier for each user

    if not user_message or not user_id:
        return jsonify({"error": "Message and user_id fields are required"}), 400

    # Initialize the system message if history is empty
    if not user_histories[user_id]:
        user_histories[user_id].append({
            "role": "system",
            "content": "Kamu adalah seorang dokter ahli penyakit diabetes yang berpengalaman dalam menjelaskan kondisi dan perawatan diabetes kepada pasien awam. Tugas kamu adalah memberikan informasi yang akurat, sederhana, dan jelas tentang gejala, penyebab, jenis-jenis diabetes, dan cara pengelolaannya. Sampaikan penjelasan dalam bahasa yang mudah dipahami oleh orang tanpa latar belakang medis dan berikan panduan yang membantu mereka memahami kondisi mereka dengan lebih baik"
        })

    # Append the user's message to their conversation history
    user_histories[user_id].append({
        "role": "user",
        "content": user_message
    })

    try:
        # Generate response using the entire history
        completion = client.chat.completions.create(
            model=deployment,
            messages=user_histories[user_id],
            max_tokens=800,
            temperature=0.7,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None,
            stream=False,
            extra_body={
                "data_sources": [{
                    "type": "azure_search",
                    "parameters": {
                        "endpoint": search_endpoint,
                        "index_name": search_index,
                        "semantic_configuration": "default",
                        "query_type": "semantic",
                        "fields_mapping": {},
                        "in_scope": True,
                        "role_information": "Kamu adalah seorang dokter ahli penyakit diabetes yang berpengalaman dalam menjelaskan kondisi dan perawatan diabetes kepada pasien awam.",
                        "filter": None,
                        "strictness": 3,
                        "top_n_documents": 5,
                        "authentication": {
                            "type": "api_key",
                            "key": search_key
                        }
                    }
                }]
            }
        )

        # Extract and return the response message
        response_message = completion.choices[0].message.content
        
        # Append the assistant's response to the conversation history
        user_histories[user_id].append({
            "role": "assistant",
            "content": response_message
        })

        # Limit history length to manage token usage (optional)
        if len(user_histories[user_id]) > 10:
            user_histories[user_id] = user_histories[user_id][-10:]

        return jsonify({"response": response_message})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

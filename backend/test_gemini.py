from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.6-flash",
    input="Say hello to SamadhanX in one short sentence."
)

print(interaction.output_text)
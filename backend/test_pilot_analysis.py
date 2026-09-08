from app.services.ai.pilot_analysis import analyze_pilot_feedback


feedback = """
The solar water ATM was easy to use and villagers appreciated
having access to clean drinking water nearby.

However, the machine stopped working twice because of filter
maintenance issues. Some elderly users found the digital
payment system difficult to understand.

Most users said they would continue using the system if
maintenance was faster and payment options were simpler.
"""


result = analyze_pilot_feedback(feedback)

print("\nPilot Analysis Result:")
print(result.model_dump())
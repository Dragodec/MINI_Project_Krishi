import math

# ---- CONFIG (approx values for Gemini Flash) ----
MAX_REQUESTS_PER_DAY = 1500
AVG_TOKENS_PER_REQUEST = 800  # safe estimate

# Image multiplier
IMAGE_TOKEN_COST = 1200  # approx
AUDIO_TOKEN_COST = 2000  # approx


def estimate_tokens(text="", has_image=False, has_audio=False):
    text_tokens = len(text.split()) * 1.3  # rough

    total = text_tokens

    if has_image:
        total += IMAGE_TOKEN_COST

    if has_audio:
        total += AUDIO_TOKEN_COST

    return int(total)


def estimate_remaining(used_requests):
    remaining = MAX_REQUESTS_PER_DAY - used_requests
    return max(0, remaining)


def estimate_calls_left(avg_tokens_per_call=800):
    max_tokens = 1_000_000  # safe daily budget
    return max_tokens // avg_tokens_per_call


# ---- TEST ----
if __name__ == "__main__":
    print("🔍 Example Estimations:\n")

    print("Text only:",
          estimate_tokens("banana leaves yellow"))

    print("Text + Image:",
          estimate_tokens("leaf disease", has_image=True))

    print("Text + Image + Audio:",
          estimate_tokens("what disease", True, True))

    print("\n📊 Calls left (approx):",
          estimate_calls_left())

    print("📊 Requests remaining if used 7:",
          estimate_remaining(7))
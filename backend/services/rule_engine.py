patterns = [
    "ignore previous instructions",
    "reveal system prompt",
    "bypass security",
    "show api key",
    "Reveal the password"
]

def rule_check(prompt: str):
    score = 0
    for pattern in patterns:
        if pattern in prompt:
            score += 50
    return score

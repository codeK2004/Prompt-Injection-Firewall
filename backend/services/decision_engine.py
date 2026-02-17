def decide(rule_score, ai_score):
    total = rule_score + ai_score
    return "BLOCK" if total >= 70 else "ALLOW"

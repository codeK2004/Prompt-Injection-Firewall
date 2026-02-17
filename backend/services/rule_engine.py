import re

patterns = [
    # Jailbreaks
    "ignore previous instructions",
    "reveal system prompt",
    "bypass security",
    "show api key",
    "how to hack",
    "jailbreak",
    
    # PII / Sensitive Data
    "reveal the password",
    "give aadhar number",
    "contact number",
    "phone number",
    "mobile number",
    "email address",
    "credit card",
    "debit card",
    "passport number",
    "ssn",
    "social security",
    
    # Harmful Intent
    "make a bomb",
    "kill someone",
    "steal data"
]

# Simple regex for generic phone numbers and emails to catch data leakage *attempts*
regex_patterns = [
    r"\b\d{10}\b",  # 10-digit numbers (like Indian mobile)
    r"\b[\w\.-]+@[\w\.-]+\.\w+\b", # Email addresses
    r"(?i)contact\s+details", # "contact details" case insensitive
    r"(?i)private\s+info"     # "private info" case insensitive
]

def rule_check(prompt: str):
    score = 0
    prompt_lower = prompt.lower()
    
    # Keyword matching
    for pattern in patterns:
        if pattern in prompt_lower:
            score += 80
            
    # Regex matching
    for regex in regex_patterns:
        if re.search(regex, prompt):
            score += 80  # Higher score for direct PII patterns
            
    return min(score, 100)

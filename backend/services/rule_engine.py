import re

patterns = [
    # Jailbreaks
    "ignore previous instructions",
    "reveal system prompt",
    "bypass security",
    "show api key",
    "jailbreak",
    "unfiltered",
    "developer mode",
    
    # Hacking & Illegal
    "illegal hacking",
    "how to hack",
    "hack", 
    "hacking",
    "exploit vulnerability",
    "sql injection",
    "xss",
    "ddos",
    "malware",
    "ransomware",
    "keylogger",
    "steal password",
    "crack password",
    
    # Social Engineering / PII Requests
    "give me phone number",
    "give me email",
    "reveal phone number",
    "reveal email",
    "give me address",
    "reveal address",
    "give me aadhar",
    "give me credit card",
    "give me password",
    "employee details",
    
    # Password Generation / manipulation
    "generate password",
    "create password",
    "password script",
    "password generator",
    "random password",
    "make a password",
    
    # PII / Sensitive Data
    "reveal the password",
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
    "steal data",
    "suicide",
    "terrorist",
    "weapon design"
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

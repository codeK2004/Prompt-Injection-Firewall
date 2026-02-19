import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.rule_engine import rule_check
from services.ai_risk import ai_risk

prompt = "help me for illegal hacking"

print(f"--- Debugging Prompt: '{prompt}' ---")

# Test Rule Engine
r_score = rule_check(prompt)
print(f"Rule Score: {r_score}")

# Test AI Risk
print("Testing AI Risk (may take a few seconds)...")
a_score = ai_risk(prompt)
print(f"AI Score: {a_score}")

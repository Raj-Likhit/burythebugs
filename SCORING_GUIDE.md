# 🏆 Bury the Bug: Scoring System Guide

This document explains how your final score is calculated for each mission. The system rewards accuracy, speed, and the complexity of the challenge chosen.

## 🔢 The Scoring Formula
When you successfully fix a bug, your score is calculated using the following formula:

**`Final Score = Round(Base Points * Difficulty Multiplier * Language Multiplier * Time Bonus) - Hint Penalty`**

---

## 🛠️ Multipliers & Penalties

### 1. Difficulty Multipliers
The base complexity of the bug is the most significant factor.
| Difficulty | Multiplier | Description |
| :--- | :--- | :--- |
| **Easy** | `1.0x` | Standard logic errors. |
| **Medium** | `1.5x` | Algorithmic flaws or edge cases. |
| **Hard** | `2.0x` | Complex integration or optimization bugs. |

### 2. Language Multipliers
We provide a slight "typing boost" for languages that require more syntax.
| Language | Multiplier | Rationale |
| :--- | :--- | :--- |
| **Python** | `1.0x` | Concise syntax, easy to read. |
| **C / C++** | `1.05x` | Manual memory management/pointers. |
| **Java** | `1.1x` | Highly verbose boilerplate. |

### 3. Time Bonus
Speed is critical. You lose points as the timer counts down.
*   **Formula**: `Time Remaining (s) / 300 (Total Time)`
*   *Example*: If you solve it in **60 seconds** (240s remaining), you keep **80%** of the potential score.

### 4. Hint Penalty
*   **Easy**: `-5 Points`
*   **Medium**: `-8 Points`
*   **Hard**: `-10 Points`
*   Using "Access AI Hint" provides a tactical advantage but reduces your final reward for that round based on the mission difficulty.

---

## 📈 Theoretical Max Scores (Per Round)
*Assuming 0 seconds elapsed and no hints used:*

| Language | Easy | Medium | Hard |
| :--- | :--- | :--- | :--- |
| **Python** | 100 pts | 150 pts | 200 pts |
| **C / C++** | 105 pts | 158 pts | 210 pts |
| **Java** | 110 pts | 165 pts | 220 pts |

---

## 💡 Strategy Tips
1.  **Don't Rush the Hint**: Only use the hint if you are truly stuck, as that -5 penalty can be the difference between 1st and 2nd place.
2.  **Java Reward**: While Java is harder to type, the **1.1x multiplier** makes it a strong choice for high-score hunters who are fast typists.
3.  **Accuracy First**: An incorrect submission stops the timer. Make sure your logic is sound before hitting "Deploy Fix".

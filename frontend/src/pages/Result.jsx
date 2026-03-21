import { useState } from "react";

export default function Result({ result, bug, onPlayAgain, onLeaderboard }) {
  const [showSolution, setShowSolution] = useState(true);

  if (!result) return null;

  const { passed, score, explanation, correct_code, timeTaken, timeRemaining } = result;
  
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeStr = `${minutes}m ${seconds}s`;
  
  const timeBonus = ((timeRemaining || 0) / 300 * 100).toFixed(0);

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "#080B0F",
        backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        animation: "fadeIn 200ms ease-out forwards",
      }}>
      <style>{`
        @keyframes fadeIn { 
          from{opacity:0;transform:translateY(8px)} 
          to{opacity:1;transform:translateY(0)} 
        }
      `}</style>
      <div className="w-full" style={{ maxWidth: "600px" }}>
        {passed ? (
          <div>
            <h1 className="text-center font-mono font-bold"
              style={{
                color: "#00FF94", fontSize: "52px",
                textShadow: "0 0 30px #00FF9466",
                wordSpacing: "0px",
                letterSpacing: "-0.02em",
              }}>
              BUG BURIED
            </h1>
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", width: "100%",
              marginTop: "16px",
            }}>
              <pre style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px", lineHeight: 1.5,
                color: "#00FF94", textAlign: "left",
                margin: "0 auto", display: "inline-block",
              }}>
{`  ___
 |   |
 | RIP |
 | BUG |
 |_____|`}
              </pre>
            </div>
            <div className="text-center mt-8">
              <p className="uppercase" style={{
                color: "#484F58", fontSize: "11px",
                letterSpacing: "0.1em",
              }}>
                YOUR SCORE
              </p>
              <p className="font-mono font-bold" style={{
                color: "#E6EDF3", fontSize: "64px",
              }}>
                {score}
                <span style={{
                  fontSize: "48px", marginLeft: "4px",
                }}>pts</span>
              </p>
            </div>
            <div className="mt-6" style={{
              backgroundColor: "#161B22",
              border: "1px solid #30363D",
              borderTop: "2px solid #00FF94",
              borderRadius: "10px", padding: "24px",
            }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <p className="font-mono font-bold"
                    style={{ color: "#E6EDF3", fontSize: "20px" }}>
                    {timeStr}
                  </p>
                  <p className="uppercase mt-1" style={{
                    color: "#484F58", fontSize: "10px",
                  }}>
                    TIME TAKEN
                  </p>
                </div>
                <div style={{ width: "1px", height: "40px", backgroundColor: "#30363D" }}/>
                <div className="flex-1 text-center">
                  <span style={{
                    color: "#FFB800", backgroundColor: "#FFB80022",
                    border: "1px solid #FFB80044", padding: "4px 12px",
                    borderRadius: "4px", fontSize: "14px", fontWeight: 600,
                  }}>
                    {bug?.difficulty?.toUpperCase() || '-'}
                  </span>
                  <p className="uppercase mt-2" style={{
                    color: "#484F58", fontSize: "10px",
                  }}>
                    DIFFICULTY
                  </p>
                </div>
                <div style={{ width: "1px", height: "40px", backgroundColor: "#30363D" }}/>
                <div className="flex-1 text-center">
                  <p className="font-mono font-bold"
                    style={{ color: "#00FF94", fontSize: "20px" }}>
                    +{timeBonus}%
                  </p>
                  <p className="uppercase mt-1" style={{
                    color: "#484F58", fontSize: "10px",
                  }}>
                    TIME BONUS
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 font-bold cursor-pointer"
                onClick={onPlayAgain}
                style={{
                  backgroundColor: "#00FF94", color: "#080B0F", borderRadius: "6px",
                  padding: "12px 32px", fontSize: "15px", border: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor="#00CC77"; e.currentTarget.style.transform="scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor="#00FF94"; e.currentTarget.style.transform="scale(1)"; }}>
                PLAY AGAIN
              </button>
              <button className="flex-1 font-bold cursor-pointer"
                onClick={onLeaderboard}
                style={{
                  backgroundColor: "transparent", border: "1px solid #00FF94",
                  color: "#00FF94", borderRadius: "6px", padding: "12px 32px", fontSize: "15px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor="#00FF9415"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor="transparent"; }}>
                KILL FEED
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-center font-mono font-bold"
              style={{
                color: "#FF3B3B", fontSize: "52px",
                textShadow: "0 0 30px #FF3B3B66",
              }}>
              BUG ESCAPED
            </h1>
            <pre className="text-center mt-2" style={{
              color: "#FF3B3B", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px",
            }}>
              {`>>=[ ~~~\n(gone)`}
            </pre>
            <div className="text-center mt-8">
              <p className="uppercase" style={{
                color: "#484F58", fontSize: "11px", letterSpacing: "0.1em",
              }}>
                YOUR SCORE
              </p>
              <p className="font-mono font-bold" style={{
                color: "#484F58", fontSize: "64px",
              }}>
                0 pts
              </p>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between"
                style={{
                  backgroundColor: "#161B22", border: "1px solid #30363D",
                  borderRadius: "6px 6px 0 0", padding: "10px 16px",
                }}>
                <span className="uppercase" style={{
                  color: "#484F58", fontSize: "11px", letterSpacing: "0.1em",
                }}>
                  CORRECT SOLUTION
                </span>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="cursor-pointer"
                  style={{
                    color: "#484F58", fontSize: "11px", backgroundColor: "transparent", border: "none",
                  }}>
                  {showSolution ? "HIDE ▲" : "SHOW ▼"}
                </button>
              </div>
              {showSolution && (
                <pre className="font-mono" style={{
                  backgroundColor: "#0D1117", border: "1px solid #30363D", borderTop: "none",
                  borderRadius: "0 0 6px 6px", padding: "16px", fontSize: "14px",
                  lineHeight: 1.6, overflowX: "auto", color: "#E6EDF3",
                }}>
                  {correct_code}
                </pre>
              )}
            </div>
            <div className="mt-4" style={{
              backgroundColor: "#161B22", borderLeft: "3px solid #FF3B3B",
              borderRadius: "0 6px 6px 0", padding: "16px",
            }}>
              <p className="uppercase" style={{
                color: "#FF3B3B", fontSize: "11px", letterSpacing: "0.1em",
              }}>
                WHAT WENT WRONG
              </p>
              <p className="mt-2" style={{
                color: "#8B949E", fontSize: "14px", lineHeight: 1.6,
              }}>
                {explanation}
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 font-bold cursor-pointer"
                onClick={onPlayAgain}
                style={{
                  backgroundColor: "#00FF94", color: "#080B0F", borderRadius: "6px",
                  padding: "12px 32px", fontSize: "15px", border: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor="#00CC77"; e.currentTarget.style.transform="scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor="#00FF94"; e.currentTarget.style.transform="scale(1)"; }}>
                PLAY AGAIN
              </button>
              <button className="flex-1 font-bold cursor-pointer"
                onClick={onLeaderboard}
                style={{
                  backgroundColor: "transparent", border: "1px solid #00FF94",
                  color: "#00FF94", borderRadius: "6px", padding: "12px 32px", fontSize: "15px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor="#00FF9415"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor="transparent"; }}>
                KILL FEED
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

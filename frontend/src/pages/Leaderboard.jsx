import { useState, useEffect } from "react";

const langStyles = {
  python: { bg:"#3776AB22", color:"#3776AB", border:"#3776AB44" },
  c: { bg:"#A8B9CC22", color:"#A8B9CC", border:"#A8B9CC44" },
  cpp: { bg:"#00599C22", color:"#4D9EFF", border:"#00599C44" },
  java: { bg:"#ED8B0022", color:"#ED8B00", border:"#ED8B0044" },
};

const diffStyles = {
  easy: { bg:"#4D9EFF22", color:"#4D9EFF", border:"#4D9EFF44" },
  medium: { bg:"#FFB80022", color:"#FFB800", border:"#FFB80044" },
  hard: { bg:"#BF5FFF22", color:"#BF5FFF", border:"#BF5FFF44" },
};

function getRank(rank) {
  if (rank === 1) return { display: "♛ 1", color: "#FFD700" };
  if (rank === 2) return { display: "  2", color: "#C0C0C0" };
  if (rank === 3) return { display: "  3", color: "#CD7F32" };
  return { display: `#${rank}`, color: "#484F58" };
}

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchScores = async () => {
    try {
      const res = await fetch(
        "/api/leaderboard"
      );
      const data = await res.json();
      setScores(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{
      backgroundColor: "#080B0F",
      backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}>
      <style>{`
        @keyframes livePulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.5;transform:scale(1.3)}
        }
      `}</style>
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-mono font-bold" style={{
              color: "#00FF94", fontSize: "36px",
              textShadow: "0 0 20px #00FF9466",
            }}>
              KILL FEED
            </h1>
            <p style={{ color:"#8B949E", fontSize:"14px",
              marginTop:"4px" }}>
              Top bug hunters of the session
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{
              width:"8px", height:"8px",
              borderRadius:"50%",
              backgroundColor:"#00FF94",
              animation:"livePulse 1.5s infinite",
            }}/>
            <span style={{
              color:"#00FF94", fontSize:"11px",
              textTransform:"uppercase",
              letterSpacing:"0.1em",
            }}>LIVE</span>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center" style={{
            backgroundColor:"#161B22",
            border:"1px solid #30363D",
            borderRadius:"6px 6px 0 0",
            padding:"10px 20px",
          }}>
            {["RANK","CALLSIGN","LANGUAGE",
              "SCORE","DIFFICULTY","TIME"].map((h,i) => (
              <span key={h} style={{
                width: i===0?"60px":i===5?"80px":"100px",
                flex: i===1 ? 1 : undefined,
                color:"#484F58", fontSize:"11px",
                textTransform:"uppercase",
                letterSpacing:"0.1em",
              }}>{h}</span>
            ))}
          </div>
          {scores.map((row, index) => {
            const rankInfo = getRank(index + 1);
            const lang = langStyles[row.language] || 
              langStyles.python;
            const diff = diffStyles[row.difficulty] || 
              diffStyles.medium;
            const isLast = index === scores.length - 1;
            const isEven = index % 2 === 1;
            const mins = Math.floor(
              (300 - row.timeRemaining) / 60
            ).toString().padStart(2,"0");
            const secs = (
              (300 - row.timeRemaining) % 60
            ).toString().padStart(2,"0");
            return (
              <div key={row.id || index}
                className="flex items-center cursor-pointer"
                style={{
                  padding:"14px 20px",
                  backgroundColor: isEven ? 
                    "#ffffff03" : "transparent",
                  borderBottom: isLast ? 
                    "none" : "1px solid #21262D",
                  borderLeft:"1px solid #30363D",
                  borderRight:"1px solid #30363D",
                  borderBottomLeftRadius: isLast ? 
                    "6px" : "0",
                  borderBottomRightRadius: isLast ? 
                    "6px" : "0",
                  transition:"background-color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor=
                    "#1C2128";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor=
                    isEven ? "#ffffff03" : "transparent";
                }}>
                <span className="font-mono" style={{
                  width:"60px", color:rankInfo.color,
                  fontSize:"14px", fontWeight:600,
                }}>
                  {rankInfo.display}
                </span>
                <span style={{
                  flex:1, color:"#E6EDF3",
                  fontSize:"14px", fontWeight:600,
                }}>
                  {row.name}
                </span>
                <span style={{ width:"100px" }}>
                  <span style={{
                    backgroundColor:lang.bg,
                    color:lang.color,
                    border:`1px solid ${lang.border}`,
                    padding:"2px 8px", borderRadius:"4px",
                    fontSize:"10px",
                    textTransform:"uppercase",
                    letterSpacing:"0.1em",
                  }}>
                    {row.language}
                  </span>
                </span>
                <span className="font-mono" style={{
                  width:"100px", color:"#00FF94",
                  fontSize:"14px", fontWeight:700,
                }}>
                  {row.score}
                </span>
                <span style={{ width:"100px" }}>
                  <span style={{
                    backgroundColor:diff.bg,
                    color:diff.color,
                    border:`1px solid ${diff.border}`,
                    padding:"2px 8px", borderRadius:"4px",
                    fontSize:"10px",
                    textTransform:"uppercase",
                    letterSpacing:"0.1em",
                  }}>
                    {row.difficulty}
                  </span>
                </span>
                <span className="font-mono" style={{
                  width:"80px", color:"#8B949E",
                  fontSize:"13px",
                }}>
                  {mins}:{secs}
                </span>
              </div>
            );
          })}
          {scores.length === 0 && (
            <div style={{
              padding:"40px", textAlign:"center",
              color:"#484F58",
              border:"1px solid #30363D",
              borderTop:"none",
              borderRadius:"0 0 6px 6px",
            }}>
              No scores yet. Be the first bug hunter!
            </div>
          )}
        </div>
        <div className="flex items-center 
          justify-between mt-6">
          <span style={{ color:"#484F58", 
            fontSize:"12px" }}>
            Showing top {scores.length} results
          </span>
          <button className="cursor-pointer" style={{
            backgroundColor:"transparent",
            border:"1px solid #30363D",
            color:"#484F58", padding:"8px 20px",
            borderRadius:"6px", fontSize:"13px",
            transition:"all 150ms ease",
          }}
          onClick={onBack}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor="#00FF94";
            e.currentTarget.style.color="#00FF94";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor="#30363D";
            e.currentTarget.style.color="#484F58";
          }}>
            ← BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: 1, icon: "🔭", label: "Search Agent", desc: "Scanning the cosmos for information..." },
  { id: 2, icon: "🛸", label: "Reader Agent", desc: "Deep-diving into sources..." },
  { id: 3, icon: "✍️", label: "Writer", desc: "Drafting your research report..." },
  { id: 4, icon: "⭐", label: "Critic", desc: "Reviewing and scoring the report..." },
];

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const shooters = [];
    const spawnShooter = () => {
      if (shooters.length < 2) {
        shooters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          len: Math.random() * 80 + 60,
          speed: Math.random() * 6 + 5,
          alpha: 1,
          angle: Math.PI / 6,
        });
      }
    };
    const shootInterval = setInterval(spawnShooter, 3500);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${s.alpha})`;
        ctx.fill();
      });
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = "rgba(150, 180, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
        ctx.restore();
        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        s.alpha -= 0.018;
        if (s.alpha <= 0) shooters.splice(i, 1);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

function OrbitLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "2rem 0" }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid rgba(109,40,217,0.3)",
          borderTopColor: "#7c3aed",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 10, borderRadius: "50%",
          border: "2px solid rgba(6,182,212,0.2)",
          borderBottomColor: "#06b6d4",
          animation: "spin 1.5s linear infinite reverse",
        }} />
        <div style={{
          position: "absolute", inset: "50%", transform: "translate(-50%,-50%)",
          width: 10, height: 10, borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa, #7c3aed)",
        }} />
      </div>
      <p style={{ color: "#94a3b8", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Agents working
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PipelineSteps({ activeStep, completedSteps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "2rem 0 1.5rem", flexWrap: "wrap" }}>
      {STEPS.map((step, i) => {
        const done = completedSteps.includes(step.id);
        const active = activeStep === step.id;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
                background: done
                  ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                  : active
                  ? "rgba(124,58,237,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: active
                  ? "1.5px solid #7c3aed"
                  : done
                  ? "none"
                  : "1.5px solid rgba(255,255,255,0.1)",
                boxShadow: active ? "0 0 18px rgba(124,58,237,0.4)" : "none",
                transition: "all 0.4s ease",
              }}>
                {done ? "✓" : step.icon}
              </div>
              <span style={{
                fontSize: 11, color: done ? "#a78bfa" : active ? "#c4b5fd" : "#475569",
                fontWeight: active || done ? 600 : 400,
                letterSpacing: "0.04em",
                textAlign: "center", maxWidth: 70,
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 40, height: 1.5, marginBottom: 18,
                background: completedSteps.includes(step.id + 1) || done
                  ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                  : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function GlassCard({ title, icon, children, accentColor = "#7c3aed", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      background: "rgba(15, 10, 46, 0.6)",
      border: "1px solid rgba(124,58,237,0.2)",
      borderRadius: 16,
      padding: "1.5rem",
      backdropFilter: "blur(12px)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function ScoreRing({ score }) {
  const num = parseInt(score) || 0;
  const color = num >= 8 ? "#22d3ee" : num >= 6 ? "#a78bfa" : "#f472b6";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1rem" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: `conic-gradient(${color} ${num * 36}deg, rgba(255,255,255,0.06) 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: "#0a0618",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color,
        }}>
          {num}
        </div>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Critic Score</p>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color }}>{num}/10</p>
      </div>
    </div>
  );
}

export default function Cosmo() {
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState("idle");
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentStepDesc, setCurrentStepDesc] = useState("");

  const simulateResearch = async () => {
    if (!topic.trim()) return;
    setPhase("running");
    setResults(null);
    setError(null);
    setCompletedSteps([]);

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    try {
      setActiveStep(1);
      setCurrentStepDesc(STEPS[0].desc);
      const searchRes = await fetch("http://localhost:8000/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!searchRes.ok) throw new Error(`Server error: ${searchRes.status}`);
      const data = await searchRes.json();

      setCompletedSteps([1]);
      await delay(400);
      setActiveStep(2);
      setCurrentStepDesc(STEPS[1].desc);
      await delay(600);

      setCompletedSteps([1, 2]);
      await delay(400);
      setActiveStep(3);
      setCurrentStepDesc(STEPS[2].desc);
      await delay(600);

      setCompletedSteps([1, 2, 3]);
      await delay(400);
      setActiveStep(4);
      setCurrentStepDesc(STEPS[3].desc);
      await delay(600);

      setCompletedSteps([1, 2, 3, 4]);
      setActiveStep(null);
      setResults(data);
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase("error");
      setActiveStep(null);
    }
  };

  const reset = () => {
    setPhase("idle");
    setTopic("");
    setResults(null);
    setError(null);
    setActiveStep(null);
    setCompletedSteps([]);
  };

  const extractScore = (feedback) => {
    if (!feedback) return null;
    const match = feedback.match(/Score:\s*(\d+)/i);
    return match ? match[1] : null;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #03030f 0%, #0f0a2e 50%, #03030f 100%)",
      fontFamily: "'Inter', sans-serif",
      position: "relative", overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <StarField />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "0 1.5rem 4rem" }}>

        {/* Navbar */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "3rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>✦</div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20, fontWeight: 700,
              background: "linear-gradient(90deg, #a78bfa, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
            }}>COSMO</span>
          </div>
          <span style={{ fontSize: 12, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            AI Research Navigator
          </span>
        </nav>

        {/* Hero */}
        {phase === "idle" && (
          <div style={{ textAlign: "center", padding: "2rem 0 3rem" }}>
            <div style={{ fontSize: 56, marginBottom: "1.5rem", lineHeight: 1 }}>🌌</div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700, margin: "0 0 1rem",
              background: "linear-gradient(135deg, #f0f4ff 30%, #a78bfa 70%, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.15,
            }}>
              Explore the universe<br />of knowledge
            </h1>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Cosmo deploys AI agents to search, scrape, write, and critique — delivering deep research on any topic in seconds.
            </p>

            {/* Search Input */}
            <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
              <div style={{
                display: "flex", gap: 0,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 14, padding: 6,
                boxShadow: "0 0 40px rgba(124,58,237,0.1)",
                transition: "box-shadow 0.3s",
              }}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && simulateResearch()}
                  placeholder="What shall we explore today?"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#f0f4ff", fontSize: 15, padding: "0.75rem 1rem",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  onClick={simulateResearch}
                  disabled={!topic.trim()}
                  style={{
                    background: topic.trim()
                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                      : "rgba(255,255,255,0.06)",
                    border: "none", borderRadius: 10,
                    color: topic.trim() ? "#fff" : "#334155",
                    padding: "0.75rem 1.5rem",
                    fontSize: 14, fontWeight: 600, cursor: topic.trim() ? "pointer" : "default",
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "0.04em",
                    transition: "all 0.3s",
                    whiteSpace: "nowrap",
                  }}
                >
                  Launch ✦
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
              {["Black holes", "Quantum computing", "Ancient Rome", "CRISPR gene editing"].map((s) => (
                <button key={s} onClick={() => setTopic(s)} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "6px 16px", color: "#64748b",
                  fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Running Phase */}
        {phase === "running" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13, color: "#7c3aed", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: "0.5rem",
            }}>Researching</p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.6rem", fontWeight: 700, color: "#f0f4ff", margin: "0 0 0.5rem",
            }}>"{topic}"</h2>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: "1.5rem" }}>{currentStepDesc}</p>
            <PipelineSteps activeStep={activeStep} completedSteps={completedSteps} />
            <OrbitLoader />
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div style={{
            textAlign: "center", padding: "3rem",
            background: "rgba(244,63,94,0.06)",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 40, marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ color: "#f472b6", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>
              Mission aborted
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: "1.5rem" }}>{error}</p>
            <button onClick={reset} style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              border: "none", borderRadius: 10, color: "#fff",
              padding: "0.75rem 2rem", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            }}>Try again</button>
          </div>
        )}

        {/* Results */}
        {phase === "done" && results && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase" }}>Mission complete</p>
                <h2 style={{
                  margin: "4px 0 0", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.4rem", fontWeight: 700, color: "#f0f4ff",
                }}>"{topic}"</h2>
              </div>
              <button onClick={reset} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#94a3b8", padding: "8px 18px",
                fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif",
              }}>← New search</button>
            </div>

            <PipelineSteps activeStep={null} completedSteps={[1, 2, 3, 4]} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <GlassCard title="Search Results" icon="🔭" accentColor="#7c3aed" delay={0}>
                <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                  {typeof results.search_result === "string"
                    ? results.search_result.slice(0, 500) + "..."
                    : JSON.stringify(results.search_result).slice(0, 500) + "..."}
                </p>
              </GlassCard>
              <GlassCard title="Scraped Content" icon="🛸" accentColor="#06b6d4" delay={150}>
                <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  {results.scraped_content
                    ? results.scraped_content.slice(0, 500) + "..."
                    : "Content extracted from top sources."}
                </p>
              </GlassCard>
            </div>

            <GlassCard title="Research Report" icon="✍️" accentColor="#a78bfa" delay={300}>
              <div style={{
                color: "#cbd5e1", fontSize: 14, lineHeight: 1.8,
                whiteSpace: "pre-wrap", maxHeight: 400, overflowY: "auto",
                paddingRight: 8,
              }}>
                {results.report || "Report not available."}
              </div>
            </GlassCard>

            <div style={{ marginTop: 16 }}>
              <GlassCard title="Critic Review" icon="⭐" accentColor="#f472b6" delay={450}>
                {extractScore(results.feedback) && (
                  <ScoreRing score={extractScore(results.feedback)} />
                )}
                <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                  {results.feedback || "No feedback available."}
                </p>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
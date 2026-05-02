import { Search, Bell, Settings, Calendar, Star, Flame } from "lucide-react";

export default function Navbar() {
  const today = new Date().toLocaleDateString("id-ID", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="navbar" style={{ padding: "0 2rem", background: "var(--color-white)", borderBottom: "3px solid var(--color-navy)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ position: "relative", width: "300px" }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            className="input-brutal" 
            placeholder="Cari transaksi..." 
            style={{ 
              paddingLeft: "3rem", 
              paddingTop: "0.5rem", 
              paddingBottom: "0.5rem", 
              fontSize: "0.875rem",
              background: "var(--color-bg)",
              boxShadow: "2px 2px 0px var(--color-navy)"
            }} 
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.75rem", fontWeight: 600 }}>
          <Calendar size={14} />
          {today}
        </div>
      </div>

      <div className="navbar__actions" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* User Stats Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingRight: "1.25rem", borderRight: "2px solid rgba(0,0,0,0.1)" }}>
          {/* Level & Progress Group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.25rem 0.8rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "120px" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--color-text-muted)" }}>LEVEL 7</span>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--color-purple)" }}>65%</span>
            </div>
            <div style={{ width: "120px", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "100px", border: "1px solid var(--color-navy)", overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "var(--color-purple)" }}></div>
            </div>
          </div>

          {/* Badge Count */}
          <div style={{ 
            background: "var(--color-lime)", 
            color: "var(--color-navy)", 
            padding: "0.4rem 0.8rem", 
            borderRadius: "var(--radius-brutal-sm)", 
            border: "2px solid var(--color-navy)", 
            fontSize: "0.75rem", 
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "2px 2px 0px var(--color-navy)"
          }}>
            <Star size={12} strokeWidth={3} /> 5
          </div>

          {/* Streak Indicator */}
          <div style={{ 
            background: "var(--color-orange)", 
            color: "var(--color-white)", 
            padding: "0.4rem 0.8rem", 
            borderRadius: "var(--radius-brutal-sm)", 
            border: "2px solid var(--color-navy)", 
            fontSize: "0.75rem", 
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "2px 2px 0px var(--color-navy)"
          }}>
            <Flame size={12} strokeWidth={3} /> 5
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            className="btn-brutal btn-brutal--secondary btn-brutal--sm"
            style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%", background: "var(--color-white)" }}
          >
            <Bell size={20} />
          </button>
          
          <button
            className="btn-brutal btn-brutal--secondary btn-brutal--sm"
            style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%", background: "var(--color-white)" }}
          >
            <Settings size={20} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "2px solid var(--color-border-light)", paddingLeft: "1.25rem" }}>
          <div style={{ textAlign: "right", display: "none lg:block" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--color-navy)" }}>Danu Zen</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-purple)" }}>Pejuang Hemat</div>
          </div>
          <div className="navbar__avatar" style={{ 
            width: "44px", 
            height: "44px", 
            background: "var(--color-purple)", 
            color: "var(--color-white)", 
            fontSize: "1.125rem", 
            fontWeight: 800,
            border: "3px solid var(--color-navy)",
            boxShadow: "3px 3px 0px var(--color-navy)"
          }}>
            DZ
          </div>
        </div>
      </div>
    </header>
  );
}

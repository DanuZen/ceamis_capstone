"use client";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__title">
        Dashboard
      </div>
      <div className="navbar__actions">
        <button
          className="btn-brutal btn-brutal--ghost btn-brutal--sm"
          title="Notifikasi"
        >
          ●
        </button>
        <div className="navbar__avatar" title="Profil">
          U
        </div>
      </div>
    </header>
  );
}

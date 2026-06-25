# =====================================================================
# Generate-EventSystemPro.ps1
# Creates full Event System Pro front-end (mock data + working UI)
# Updated base path + X-Men/Excalibur name pool
# =====================================================================

$base = "front-ends/front-end-copilot/src"

function Write-File($path, $content) {
    $dir = Split-Path $path
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Set-Content -Path $path -Value $content -Encoding UTF8
}

# ---------------------------------------------------------
# App.tsx
# ---------------------------------------------------------
$appTsx = @'
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { JudgingPage } from "./pages/JudgingPage";
import { CONTENT_MAX_WIDTH } from "./constants/layout";

const PageShell: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "24px 12px",
        background: "#0b0c10",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH }}>
        <h1 style={{ marginBottom: 16, fontSize: 24 }}>{title}</h1>
        {children}
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <PageShell title="Login">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Email</span>
          <input
            style={{ padding: 8, borderRadius: 4, border: "1px solid #444" }}
            type="email"
            inputMode="email"
            enterKeyHint="done"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Password</span>
          <input
            style={{ padding: 8, borderRadius: 4, border: "1px solid #444" }}
            type="password"
            enterKeyHint="done"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 4,
            border: "none",
            background: "#1f6feb",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </PageShell>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageShell title="Home">
      <p style={{ marginBottom: 16 }}>Welcome. Use the Staff link to reach Judging.</p>
      <button
        onClick={() => navigate("/staff")}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "none",
          background: "#1f6feb",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Go to Staff
      </button>
    </PageShell>
  );
};

const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageShell title="Staff">
      <p style={{ marginBottom: 16 }}>Staff dashboard (mock). From here you can go to Contest Judging.</p>
      <button
        onClick={() => navigate("/judging")}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "none",
          background: "#1f6feb",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Go to Contest (Judging)
      </button>
    </PageShell>
  );
};

const StaffRedirectOnSubmit: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/staff", { replace: true });
  }, [navigate]);
  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/judging" element={<JudgingPage />} />
        <Route path="/submit-complete" element={<StaffRedirectOnSubmit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
'@

# ---------------------------------------------------------
# constants/layout.ts
# ---------------------------------------------------------
$layoutTs = @'
export const CONTENT_MAX_WIDTH = 360;
'@

# ---------------------------------------------------------
# data/legionNames.ts
# ---------------------------------------------------------
$legionNamesTs = @'
export type Sex = "male" | "female";

export interface CharacterName {
  firstName: string;
  lastName: string;
  sex: Sex;
}

const bannedWords = ["boy", "girl", "lad", "lass", "ladd", "man", "woman"];

// Legion of Super-Heroes (DC-ish)
const legionCharacters: CharacterName[] = [
  { firstName: "Tinya", lastName: "Wazzo", sex: "female" },
  { firstName: "Querl", lastName: "Dox", sex: "male" },
  { firstName: "Reep", lastName: "Daggle", sex: "male" },
  { firstName: "Lydda", lastName: "Jath", sex: "female" },
  { firstName: "Jo", lastName: "Nah", sex: "male" },
  { firstName: "Tasmia", lastName: "Mallor", sex: "female" },
  { firstName: "Drake", lastName: "Burroughs", sex: "male" },
  { firstName: "Jan", lastName: "Arrah", sex: "male" },
  { firstName: "Luornu", lastName: "Durgo", sex: "female" },
  { firstName: "Dirk", lastName: "Morgna", sex: "male" },
  { firstName: "Brek", lastName: "Bannin", sex: "male" },
  { firstName: "Laurel", lastName: "Gand", sex: "female" },
  { firstName: "Ayla", lastName: "Ranzz", sex: "female" },
  { firstName: "Vi", lastName: "Welling", sex: "female" },
  { firstName: "Chuck", lastName: "Taine", sex: "male" },
  { firstName: "Thom", lastName: "Kallor", sex: "male" },
  { firstName: "Nura", lastName: "Nal", sex: "female" },
];

// X-Men + Excalibur (only characters with first + last names)
const xmenCharacters: CharacterName[] = [
  { firstName: "Scott", lastName: "Summers", sex: "male" },
  { firstName: "Jean", lastName: "Grey", sex: "female" },
  { firstName: "Ororo", lastName: "Munroe", sex: "female" },
  { firstName: "Kurt", lastName: "Wagner", sex: "male" },
  { firstName: "Kitty", lastName: "Pryde", sex: "female" },
  { firstName: "Piotr", lastName: "Rasputin", sex: "male" },
  { firstName: "Illyana", lastName: "Rasputina", sex: "female" },
  { firstName: "Warren", lastName: "Worthington", sex: "male" },
  { firstName: "Betsy", lastName: "Braddock", sex: "female" },
  { firstName: "Brian", lastName: "Braddock", sex: "male" },
  { firstName: "Meggan", lastName: "Puceanu", sex: "female" },
  { firstName: "Rachel", lastName: "Summers", sex: "female" },
  { firstName: "Remy", lastName: "LeBeau", sex: "male" },
  { firstName: "Anna", lastName: "Marie", sex: "female" },
  { firstName: "Hank", lastName: "McCoy", sex: "male" },
  { firstName: "Jubilation", lastName: "Lee", sex: "female" },
  { firstName: "Bobby", lastName: "Drake", sex: "male" },
  { firstName: "Emma", lastName: "Frost", sex: "female" },
  { firstName: "Sean", lastName: "Cassidy", sex: "male" },
  { firstName: "Theresa", lastName: "Cassidy", sex: "female" },
  { firstName: "James", lastName: "Proudstar", sex: "male" },
  { firstName: "Shiro", lastName: "Yoshida", sex: "male" },
  { firstName: "Moira", lastName: "MacTaggert", sex: "female" },
];

const rawCharacters = [...legionCharacters, ...xmenCharacters];

function containsBannedWord(name: string): boolean {
  const lower = name.toLowerCase();
  return bannedWords.some((word) => lower.split(/\s+/).includes(word));
}

export const characters: CharacterName[] = rawCharacters.filter((c) => {
  const full = `${c.firstName} ${c.lastName}`;
  return !containsBannedWord(full);
});
'@

# ---------------------------------------------------------
# types/judgingScore.ts
# ---------------------------------------------------------
$judgingScoreTs = @'
export type ScoreDigits = [number, number, number, number];

export interface JudgingScore {
  digits: ScoreDigits;
  touched: boolean;
}

export function createInitialScore(): JudgingScore {
  return {
    digits: [0, 0, 0, 0],
    touched: false,
  };
}

export function digitsToNumber(digits: ScoreDigits): number {
  const [d0, d1, d2, d3] = digits;
  return d0 * 10 + d1 + d2 * 0.1 + d3 * 0.01;
}

export function numberToDigits(value: number): ScoreDigits {
  const clamped = Math.max(0, Math.min(99.99, value));
  const whole = Math.floor(clamped);
  const decimal = Math.round((clamped - whole) * 100);
  const tens = Math.floor(whole / 10);
  const ones = whole % 10;
  const tenths = Math.floor(decimal / 10);
  const hundredths = decimal % 10;
  return [tens, ones, tenths, hundredths];
}

export function formatScore(digits: ScoreDigits): string {
  const value = digitsToNumber(digits);
  return value.toFixed(2);
}

export function isScored(score: JudgingScore): boolean {
  if (!score.touched) return false;
  return digitsToNumber(score.digits) > 0;
}
'@

# ---------------------------------------------------------
# data/judgingColorPalette.ts
# ---------------------------------------------------------
$paletteTs = @'
export interface JudgingColor {
  id: string;
  hex: string;
}

const baseRow = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#277da1",
];

export const judgingColorPalette: JudgingColor[] = [];

let idCounter = 1;
for (let row = 0; row < 14; row++) {
  for (let col = 0; col < 8; col++) {
    const base = baseRow[col];
    const shade = row % 2 === 0 ? base : base + "cc";
    judgingColorPalette.push({
      id: `c-${idCounter++}`,
      hex: shade,
    });
  }
}
'@

# ---------------------------------------------------------
# components/PercentCompleteBar.tsx
# ---------------------------------------------------------
$percentBarTsx = @'
import React from "react";

interface PercentCompleteBarProps {
  total: number;
  scoredCount: number;
  onSubmit: () => void;
}

export const PercentCompleteBar: React.FC<PercentCompleteBarProps> = ({
  total,
  scoredCount,
  onSubmit,
}) => {
  const percent = total === 0 ? 0 : Math.round((scoredCount / total) * 100);
  const isComplete = percent >= 100;

  if (isComplete) {
    return (
      <button
        onClick={onSubmit}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 999,
          border: "none",
          background: "#2ea043",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        Submit
      </button>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          height: 12,
          borderRadius: 999,
          background: "#222",
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#1f6feb",
            transition: "width 0.2s ease-out",
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: "#ccc" }}>
        Percent Complete: {percent}%
      </div>
    </div>
  );
};
'@

# ---------------------------------------------------------
# components/CompetitorColorDialog.tsx
# ---------------------------------------------------------
$colorDialogTsx = @
import React from "react";
import { judgingColorPalette, JudgingColor } from "../data/judgingColorPalette";

interface CompetitorColorDialogProps {
  open: boolean;
  firstName: string;
  initialTopColorId?: string | null;
  initialBottomColorId?: string | null;
  onClose: () => void;
  onSave: (topColorId: string | null, bottomColorId: string | null) => void;
}

type Phase = "top" | "bottom";

export const CompetitorColorDialog: React.FC<CompetitorColorDialogProps> = ({
  open,
  firstName,
  initialTopColorId,
  initialBottomColorId,
  onClose,
  onSave,
}) => {
  const [topColorId, setTopColorId] = React.useState<string | null>(
    initialTopColorId ?? null
  );
  const [bottomColorId, setBottomColorId] = React.useState<string | null>(
    initialBottomColorId ?? null
  );
  const [phase, setPhase] = React.useState<Phase>("top");
  const [hasClickedOnce, setHasClickedOnce] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTopColorId(initialTopColorId ?? null);
      setBottomColorId(initialBottomColorId ?? null);
      setPhase("top");
      setHasClickedOnce(false);
    }
  }, [open, initialTopColorId, initialBottomColorId]);

  if (!open) return null;

  const handleColorClick = (color: JudgingColor) => {
    if (phase === "top") {
      setTopColorId(color.id);
      setPhase("bottom");
      setHasClickedOnce(true);
    } else {
      setBottomColorId(color.id);
      onSave(color.id ? topColorId ?? color.id : null, color.id);
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (hasClickedOnce) {
      onSave(topColorId ?? null, bottomColorId ?? null);
    }
    onClose();
  };

  const title =
    phase === "top"
      ? `Pick Top Color for ${firstName}`
      : `Pick Bottom Color ${firstName}`;

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 320,
          maxWidth: "90vw",
          background: "#111",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 16, margin: 0 }}>{title}</h2
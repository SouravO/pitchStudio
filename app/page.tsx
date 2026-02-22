import Link from "next/link";
import {
  Rocket,
  Search,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-hero)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Rocket
            size={28}
            style={{ color: "var(--brand-primary-light)" }}
          />
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
            className="gradient-text"
          >
            Pitch Studio
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link
            href="/admin/login"
            className="btn-secondary btn-sm"
            style={{ fontSize: "0.85rem", padding: "8px 20px" }}
          >
            <Shield size={16} />
            Investor Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 40px 60px",
          textAlign: "center",
        }}
        className="animate-fade-in-up"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            fontSize: "0.85rem",
            color: "var(--brand-primary-light)",
            marginBottom: "24px",
          }}
        >
          <Sparkles size={14} />
          Now accepting applications for 2026
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Your Startup Deserves{" "}
          <span className="gradient-text">the Right Stage</span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--foreground-muted)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Submit your startup pitch, get discovered by top investors, and
          accelerate your journey from idea to funded company.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/forms" className="btn-primary" style={{ fontSize: "1.05rem", padding: "14px 36px" }}>
            Submit Your Pitch
            <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-secondary" style={{ fontSize: "1.05rem", padding: "14px 36px" }}>
            How It Works
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          maxWidth: "900px",
          margin: "20px auto 80px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
        }}
        className="animate-fade-in-up"
      >
        {[
          { number: "500+", label: "Startups Applied", icon: <Rocket size={20} /> },
          { number: "120+", label: "Investors Active", icon: <Users size={20} /> },
          { number: "85%", label: "Review Rate", icon: <BarChart3 size={20} /> },
          { number: "48h", label: "Avg Response Time", icon: <CheckCircle size={20} /> },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card-subtle"
            style={{
              padding: "24px",
              textAlign: "center",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              style={{
                color: "var(--brand-primary-light)",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                marginBottom: "4px",
              }}
              className="gradient-text"
            >
              {stat.number}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--foreground-dimmed)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 40px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            How It <span className="gradient-text">Works</span>
          </h2>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "1.05rem",
            }}
          >
            Three simple steps to get your startup in front of investors
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {[
            {
              step: "01",
              icon: <Rocket size={32} />,
              title: "Submit Your Pitch",
              description:
                "Fill out our comprehensive questionnaire covering your startup's fundamentals, financials, traction, and vision. No login required.",
            },
            {
              step: "02",
              icon: <Search size={32} />,
              title: "Get Reviewed",
              description:
                "Our investor panel reviews every submission, evaluating your market opportunity, team, traction, and growth potential.",
            },
            {
              step: "03",
              icon: <CheckCircle size={32} />,
              title: "Get Selected",
              description:
                "Shortlisted startups are featured on our platform. Get connected with investors aligned with your vision and stage.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "40px 32px",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  fontSize: "3rem",
                  fontWeight: 800,
                  opacity: 0.06,
                  color: "var(--brand-primary-light)",
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(99, 102, 241, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand-primary-light)",
                  marginBottom: "20px",
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "var(--foreground-muted)",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "60px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "var(--gradient-brand)",
            }}
          />
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to <span className="gradient-text">Pitch</span>?
          </h2>
          <p
            style={{
              color: "var(--foreground-muted)",
              marginBottom: "32px",
              fontSize: "1.05rem",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            Takes about 15 minutes. No sign up needed. Your data is secure and
            only visible to verified investors.
          </p>
          <Link href="/forms" className="btn-primary" style={{ fontSize: "1.05rem", padding: "14px 40px" }}>
            Start Application
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "32px 40px",
          textAlign: "center",
          color: "var(--foreground-dimmed)",
          fontSize: "0.85rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Rocket size={16} style={{ color: "var(--brand-primary-light)" }} />
          <span className="gradient-text" style={{ fontWeight: 600 }}>
            Pitch Studio
          </span>
        </div>
        © {new Date().getFullYear()} Pitch Studio. All rights reserved.
      </footer>

    </div>
  );
}

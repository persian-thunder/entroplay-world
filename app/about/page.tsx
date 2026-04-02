import Nav from "@/components/Nav";

const linkStyle: React.CSSProperties = {
  color: "#111",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

export default function About() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        height: "100%",
      }}
    >
      {/* Left column — text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "2rem",
          padding: "2.8rem 2.5rem 3rem 3rem",
        }}
      >
        <Nav />

        <div
          style={{
            fontSize: "1.3rem",
            lineHeight: "1.5rem",
            color: "#111",
            width: "100%",
            paddingRight: "10%",
            letterSpacing: ".1px"
          }}
        >
          <p>
            Armon Naeini is an Iranian-American artist, creative technologist, designer and educator.
            His work and research engages metaphysical inquiry through emerging technologies, exploring the
            ecstacy and absurdity embedded in human experience. Armon leverages various programming languages to develop his work including interactive exhibits, AR applications, real-time graphics, LED sculptures, post-processing, experimental web, and custom hardware.
            <br /><br />
            Currently, Armon is a professor at the School of Visual Arts teaching
            creative code to juniors & seniors in the BFA Design program. He is also currently working
            as a freelance product designer & developer.
            <br /><br />
            Armon has exhibited his work at The Music Center LA, Secret Riso
            Club, ZeroSpace, Meow Wolf, Center for Performance Research, NYU,
            Newlab, Barnard Movement Lab, Times Square Billboards, School of
            Visual Arts, Jacob&apos;s Pillow and has had his work featured in
            the New York Times as well as NBC news.
          </p>
          <p></p>
          <p style={{ marginTop: "1.25rem" }}>
            <a href="https://linkedin.com/in/armonnaeini" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
            {" · "}
            <a href="/files/resume.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Resume</a>
            {" · "}
            <a href="/files/cv.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>CV</a>
            {" · "}
            <a href="https://instagram.com/entroplay" target="_blank" rel="noopener noreferrer" style={linkStyle}>Instagram</a>
            {" · "}
            <a href="https://github.com/persian-thunder" target="_blank" rel="noopener noreferrer" style={linkStyle}>Github</a>
            {" · "}
            <a href="mailto:armon@entroplay.world" style={linkStyle}>Email</a>
          </p>
        </div>
      </div>

      {/* Right column — photo */}
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me.png"
          alt="Armon Naeini"
          style={{
            height: "94vh",
            width: "auto",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { SetLeftSlot } from "@/components/LeftSlot";

const linkStyle: React.CSSProperties = {
  color: "#111",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const bio = (
  <div
    style={{
      fontSize: "1.3rem",
      lineHeight: "1.5rem",
      color: "#111",
      paddingRight: "0%",
      letterSpacing: ".1px",
      marginTop: "2rem",
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
      <a href="mailto:armon@entroplay.world" target="_blank" rel="noopener noreferrer" style={linkStyle}>Email</a>
    </p>
  </div>
);

export default function About() {
  return (
    <>
      <SetLeftSlot>{bio}</SetLeftSlot>
      {/* Right column — photo */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me.png"
          alt="Armon Naeini"
          style={{ maxHeight: "94vh", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block", alignSelf: "flex-end" }}
        />
      </div>
    </>
  );
}

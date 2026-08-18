"use client";

import { SetLeftSlot } from "@/components/LeftSlot";

const linkStyle: React.CSSProperties = {
  color: "#111",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const bio = (
  <div className="about-copy">
    <p>
      Armon Naeini is an Iranian-American creative technologist, artist, designer and educator.
      His research engages metaphysical inquiry through experimental technologies, exploring the surrealism embedded in human identity. Armon leverages various programming languages to develop his work spanning interactive installations, AR/XR/MR, real-time graphics, LED mapping, projection & laser mapping, post-production, interactive web, and microcomputing.
      <br /><br />
      Currently, Armon is a professor at the School of Visual Arts and the New York Institute of Technology where he teaches TouchDesigner, creative coding and HCI to both undergraduate and graduate students.
      <br /><br />
      Armon has exhibited his work at The Music Center LA, Secret Riso
      Club, ZeroSpace, Onassis ONX, Abrons Arts Center, Meow Wolf, Center for Performance Research, NYU,
      Newlab, Barnard Movement Lab, Times Square Billboards, School of
      Visual Arts, and Jacob&apos;s Pillow. His work has been featured in
      The New York Times as well as NBC News.
    </p>
    <p style={{ marginTop: "1.25rem" }}>
      <a href="https://linkedin.com/in/armonnaeini" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
      {" · "}
      <a href="https://instagram.com/entroplay" target="_blank" rel="noopener noreferrer" style={linkStyle}>Instagram</a>
      {" · "}
      <a href="https://github.com/persian-thunder" target="_blank" rel="noopener noreferrer" style={linkStyle}>Github</a>
      {" · "}
      <a href="mailto:armon@entroplay.world" target="_blank" rel="noopener noreferrer" style={linkStyle}>Email</a>
      {" · "}
      <a href="/files/cv_resume_naeini.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Resume + CV</a>
    </p>
  </div>
);

export default function About() {
  return (
    <>
      <SetLeftSlot>{bio}</SetLeftSlot>
      {/* Right column — photo */}
      <div className="about-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/me.png" alt="Armon Naeini" />
      </div>
    </>
  );
}

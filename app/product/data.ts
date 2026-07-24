export type Design = {
    title: string;
    year: string;
    description: string;
    credits?: { role: string; name: string }[];
    images: string[];
    videos?: { vimeoId: string; title?: string; caption?: string }[];
    youtubeIds?: string[];
};

export const design: Record<string, Design> = {
    baton: {
        title: "Baton",
        year: "2021–",
        description: "Joined as employee #1 in November 2021 as the founding designer. I've had the pleasure of working as the Design Lead and Creative Technologist for Baton since then.\n\nBaton is the new home for unreleased music. Baton is a desktop and mobile app for musicians to store ideas, experiment with sound, and collaborate from anywhere.",
        images: [
            "/img/baton/1.png",
            "/img/baton/2.png",
            "/img/baton/3.png",
            "/img/baton/4.png",
            "/img/baton/5.png",
            "/img/baton/6.png",
            "/img/baton/7.gif",
            "/img/baton/8.png",
            "/img/baton/9.png",
            "/img/baton/10.png",
        ],
    },
    "rare-candy": {
        title: "Rare Candy",
        year: "2024",
        description: "Short term contract to design a new pack opening experience for web and mobile for trading card company Rare Candy. Worked on iOS prototyping in Swift and SwiftUI, 3D design and development, and designing the PDP shopping UI/UX for web and mobile.",
        images: [
            "/img/candy/1.png",
            "/img/candy/2.png",
            "/img/candy/3.png",
        ],
    },
    fuegoux: {
        title: "FuegoUX",
        year: "2025",
        description: "Design + development --> Figma, After Effects, Illustrator, WebGL/ThreeJS, NextJS, Sanity",
        images: [],
        videos: [{ vimeoId: "1212471990" }],
    },
};

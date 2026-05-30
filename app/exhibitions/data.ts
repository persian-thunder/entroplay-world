export type Exhibition = {
    title: string;
    year: string;
    description: string;
    credits?: { role: string; name: string }[];
    images: string[];
    videos?: { vimeoId: string; title?: string; caption?: string }[];
    youtubeIds?: string[];
};

export const exhibitions: Record<string, Exhibition> = {
    id3: {
        title: "ID Pt. III",
        year: "2025",
        description: "ID Pt. III is a continuation of my ID series, a collection of interactive, contemproy dance experiences, performances and films. It is an interactive installation developed using TouchDesigner and GLSL with an Orbbec Depth Camera. It is currently on exhibit at the Music Center LA.",
        credits: [
            { role: "Artist / Lead Creative Technologist", name: "Armon Naeini" },
            { role: "Creative Director", name: "Katherine Helen Fisher" },
        ],
        images: [],
        videos: [   { vimeoId: "1196991085" },
                    { vimeoId: "1177067554" },
                    { vimeoId: "1177069862" }
                ],
    },
    id2: {
        title: "ID Pt. II",
        year: "2025",
        description: "ID Part 2 is a contemporary dance microfilm produced for Jacob's Pillow and is currently on exhibit at their 2025 Dancing the Algorithm Interactive Exhibition.\n\nThe microfilm was developed using TouchDesigner, GLSL, and a Kinect Azure.",
        credits: [
            { role: "Artist / Lead Creative Technologist", name: "Armon Naeini" },
            { role: "Movement", name: "Aanaya Gonzalez of BODYTRAFFIC LA" },
            { role: "Creative Direction", name: "Katherine Helen Fisher" },
            { role: "Production", name: "Cameron Surh" },
        ],
        images: [],
        videos: [{ vimeoId: "1101273094" }],
    },
    resonance: {
        title: "Resonance, Self",
        year: "2023",
        description: "Resonance, Self is an audio-visual exhibition that converges auditory, physical and digital sensory domains intoa singular, shared experience.\n\nViewers are invited towards an array of oscilloscopes suspended from the ceiling, where then their image is transformed into visible + audible waveforms. The audio is played back to the viewer and is simultaneously visualized as waveforms on both the oscilloscopes and the laser projections.\n\nEverything converges in a unified experience. Audio informs image, and the image informs the audio. Experience, existence, truth lives within the resonance of self.",
        youtubeIds: ["U6etH9YYnHU"],
        images: [
            "/img/resonance/r1.jpeg",
            "/img/resonance/r2.jpeg",
            "/img/resonance/r3.jpeg",
        ],
    },
    meow: {
        title: "Galactic Autoquarium",
        year: "2024",
        description: "The Galactic Autoquarium is a full-room immersive experience living in Meow Wolf's Denver Convergence Station. This was my first creative tech gig when I graduated from undergraduate, working as both an installation artist and creative technologist.\n\n\"Welcome to the 'Galactic Autoquarium', an ancient, inter-dimensional residential community of the Great Robofish deities. Don't let their cute and dinky looks fool you, for our fishy overlords have overseen humanity since the beginning of history, baring powerful wisdoms you shall uncover. Decipher their puzzles as you explore this celestial ocean of a mirror room to unlock the secrets of life--and who knows, maybe you'll even hear them straight from the Robofish's mouth!\"",
        images: ["/img/mw/mw1.jpg",
            "/img/mw/mw2.jpg",
            "/img/mw/mw3.jpg",
            "/img/mw/mw4.jpg",
        ],
        videos: [
            { vimeoId: "889255819" } ,
        ],
    },
    dthrr: {
        title: "DTHRR",
        year: "2024",
        description: "DTHRR is a new media exhibit featuring digital sculptures, immersive installations, and visual works by artists Armon Naeini (entroplay) and Usman Jamil (Vohua Mana). The exhibit delves into the art of dithering, a technique in print and risograph that uses halftone dots to create gradients and textures. In the digital space, dithering mimics this by blending colors and pixels through intricate patterns, bridging physical and virtual aesthetics.",
        images: [
            "/img/dthrr/pamp.gif",
            "/img/dthrr/1.jpeg",
            "/img/dthrr/2.jpeg",
            "/img/dthrr/3.jpg",
            "/img/dthrr/4.png",
            "/img/dthrr/g2.gif",
            "/img/dthrr/g3.gif",
            "/img/dthrr/g4.gif",
            "/img/dthrr/5.jpg",
        ],
    },
};

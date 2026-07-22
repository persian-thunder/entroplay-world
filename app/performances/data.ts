export type Performance = {
    title: string;
    year: string;
    description: string;
    credits?: { role: string; name: string }[];
    images: string[];
    videos?: { vimeoId: string; title?: string; caption?: string }[];
    youtubeIds?: string[];
};

export const performances: Record<string, Performance> = {
    "algorithmic-bodies": {
        title: "Algorithmic Bodies",
        year: "2025",
        description: "Algorithmic Bodies examines the intersection of performance, interactive technology, and speculative futures. Led by Katherine Helen Fisher, this MeMoSa (Media Movement Salon) gathers works that dissolve the boundaries between the physical and digital, human and machine.\n\nAt Algorithmic Bodies, scuuulpt, a custom developed AR application, was presented as an experimental dance + emerging technology performance.\n\nAlgorithmic Bodies was performed at the Barnard Movement Lab on February 13th, 2025.",
        credits: [
            { role: "Contributing Artists", name: "Shimmy Boyle, Mingyong Cheng, C. Finley, August Henderson, Allysen Hooks, Joshua Kaddish, Kate Ladenheim, Armon Naeini, Jean Sonderand, Andy Tierstein, Sinziana Velicescu, Xin Ying and Alan Winslow" },
        ],
        images: [
            "/img/algo/1.jpg",
            "/img/algo/2.jpg",
            "/img/algo/3.jpg",
        ],
        videos: [{ vimeoId: "1052404617" }],
    },
    id: {
        title: "ID Pt. I",
        year: "2024",
        description: "A recursive augmentation of self. A dance with deconstruction of identity. Strip and segment me bit by bit. Performed and exhibited @ NYU's Future Stages in Fall 2024.",
        credits: [
            { role: "Artist / Lead Creative Technologist", name: "Armon Naeini" },
            { role: "Producer", name: "Caroline Haydon with Safety Third Production" },
            { role: "Host", name: "NYU Tisch School of the Arts" },
            { role: "Movement", name: "Xin Ying" },
        ],
        images: [],
        videos: [{ vimeoId: "1050221190" }],
    }
};

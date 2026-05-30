export type Research = {
    title: string;
    year: string;
    description: string;
    credits?: { role: string; name: string }[];
    link?: { label: string; url: string };
    images: string[];
    videos?: { vimeoId: string; title?: string; caption?: string }[];
    youtubeIds?: string[];
};

export const research: Record<string, Research> = {
    augmentation: {
        title: "Self Augmentation",
        year: "",
        description: "Shadow work",
        images: [],
        videos: [

            { vimeoId: "1193665328" },
            { vimeoId: "1175997425" },
            { vimeoId: "1135407035" },
            { vimeoId: "1178488927" },
            { vimeoId: "1177079489" },
            { vimeoId: "1111449053" },
            { vimeoId: "1091847809" },
            { vimeoId: "1091850901" },
            { vimeoId: "1176331347" },
            { vimeoId: "1049512909" },
            { vimeoId: "824639090" },
            { vimeoId: "1049505606" },
            { vimeoId: "1096034682" },
            { vimeoId: "1049468471" }, 
            { vimeoId: "1049468471" }, 
            { vimeoId: "1050224352" }, 
            { vimeoId: "380535086" }, 
        ],
    },
    vector: {
        title: "Vector Synthesis",
        year: "",
        description: "Real-time image to audio conversion fed into a series of analogue oscilloscopes ٩(ˊᗜˋ*)و ♡",
        images: [],
        youtubeIds: ["-IgAo-dlevg"],
        videos: [
            { vimeoId: "1147135352" },
            { vimeoId: "895121828" },
            { vimeoId: "1071950158" },
            { vimeoId: "892939183" },
            { vimeoId: "892939224" },
            { vimeoId: "892939410" },
            { vimeoId: "892410351" },
            { vimeoId: "893587636" },
        ]
    },
    charttty: {
        title: "charttty",
        year: "",
        description: "Real-time ASCII render + editor in your terminal. Super fun passion project I’ve been working on recently. Now live on my GitHub, pls go install and play. MacOS + Linux only. Learn trig ;)",
        link: { label: "GitHub", url: "https://github.com/persian-thunder/chartty" },
        images: [],
        videos: [
            { vimeoId: "1196109011" },
        ],
    },
    datamosh: {
        title: "Datamosh",
        year: "",
        description: "Real-time datamosh research conducted in a series of programming languages including ffglitch, fflive, TouchDesigner, GLSL, and openFrameworks.",
        images: [],
        videos: [
            { vimeoId: "1145686525" }, 
            { vimeoId: "1048631707" }, 
            { vimeoId: "1176336002" }, 
            { vimeoId: "1048630956" }, 
            { vimeoId: "889326000" }, 
        ],
    }
};

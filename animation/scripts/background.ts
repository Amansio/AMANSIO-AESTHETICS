import sharp from 'sharp';
// Original, layered kitchen illustration; rasterize once, not on every frame.
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#263944"/><stop offset="1" stop-color="#59716f"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#986e57"/><stop offset="1" stop-color="#332c32"/></linearGradient><linearGradient id="glass" x2="0" y2="1"><stop stop-color="#f1cb95"/><stop offset="1" stop-color="#7398a1"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#wall)"/><path d="M 0 0 H 1080 V 150 L 0 280 Z" fill="#1c2a35"/>
<rect x="-20" y="420" width="210" height="950" rx="8" fill="#1b202a" stroke="#9f7960" stroke-width="18"/><rect x="15" y="460" width="130" height="870" fill="#272c39"/><circle cx="116" cy="935" r="9" fill="#b99163"/>
<rect x="305" y="465" width="440" height="410" fill="#283b44" stroke="#b8a48b" stroke-width="20"/><rect x="328" y="488" width="394" height="365" fill="url(#glass)"/><path d="M 525 480 V 860 M 320 670 H 730" stroke="#d4c6aa" stroke-width="14"/><path d="M 333 770 Q 460 700 520 750 T 715 718 V 850 H 333Z" fill="#66877f"/>
<rect x="824" y="442" width="260" height="410" rx="6" fill="#3a4d51" stroke="#1f303a" stroke-width="8"/><path d="M 948 450 V 845 M 930 610 V 675 M 968 610 V 675" stroke="#a38d72" stroke-width="7"/>
<rect x="230" y="900" width="850" height="245" fill="#8b9a8d"/><path d="M 230 960 H 1080 M 230 1020 H 1080 M 230 1080 H 1080 M 360 900 V 1145 M 490 900 V 1145 M 620 900 V 1145 M 750 900 V 1145 M 880 900 V 1145 M 1010 900 V 1145" stroke="#72877f" stroke-width="3"/>
<rect x="225" y="1125" width="855" height="250" fill="#31454b"/><path d="M 400 1140 V 1360 M 630 1140 V 1360 M 850 1140 V 1360" stroke="#1f303a" stroke-width="7"/><path d="M 460 1180 H 555 M 680 1180 H 790 M 900 1180 H 1010" stroke="#a58c6b" stroke-width="7"/>
<rect x="210" y="1104" width="880" height="28" rx="6" fill="#d7c4a3"/><ellipse cx="530" cy="1105" rx="102" ry="12" fill="#3f555a"/><path d="M 570 1099 V 1045 Q 570 1005 535 1032" fill="none" stroke="#cabca5" stroke-width="11"/>
<rect x="905" y="1040" width="90" height="62" rx="15" fill="#27363f"/><path d="M 900 1040 H 1002" stroke="#121e29" stroke-width="10"/><path d="M 945 1022 Q 925 996 946 973" stroke="#d2c4a5" stroke-width="5" fill="none" opacity=".4"/>
<path d="M 0 1370 H 1080 V 1920 H 0 Z" fill="url(#floor)"/><path d="M 0 1490 H 1080 M 0 1650 H 1080 M 0 1870 H 1080 M 240 1370 L 80 1920 M 520 1370 L 500 1920 M 800 1370 L 960 1920" stroke="#bd8b67" stroke-width="3" opacity=".23"/>
<ellipse cx="550" cy="1440" rx="355" ry="70" fill="#b99a70" opacity=".15"/>
<path d="M 560 0 V 270" stroke="#161f29" stroke-width="8"/><path d="M 475 340 Q 483 245 560 245 Q 637 245 645 340 Z" fill="#1a2932"/><ellipse cx="560" cy="340" rx="85" ry="14" fill="#f5d4a0"/>
<rect x="780" y="1017" width="45" height="86" rx="5" fill="#b77f60"/><path d="M 800 1019 Q 743 962 778 941 Q 810 950 800 1019 M 803 1006 Q 850 929 866 965 Q 852 995 803 1006" fill="#304f46"/>
</svg>`;
sharp(Buffer.from(svg)).png().toFile('public/backgrounds/kitchen.png').catch((error)=>{console.error(error);process.exitCode=1;});

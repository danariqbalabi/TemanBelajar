import { useId } from "react";

export function WaterCycleDiagram() {
  const id = useId();
  return (
    <figure className="my-5 rounded-2xl border border-current p-3 sm:p-5">
      <svg
        viewBox="0 0 640 400"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        className="block h-auto w-full"
      >
        <title id={`${id}-title`}>Diagram siklus air</title>
        <desc id={`${id}-desc`}>
          Empat tahap terhubung searah jarum jam: penguapan, kondensasi, hujan,
          lalu aliran dan resapan. Air di permukaan dapat menguap lagi. Energi
          matahari membantu penguapan.
        </desc>
        <defs>
          <marker
            id={`${id}-arrow`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          markerEnd={`url(#${id}-arrow)`}
        >
          <path d="M 275 100 H 365" />
          <path d="M 495 160 V 240" />
          <path d="M 365 300 H 275" />
          <path d="M 145 240 V 160" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="20" y="40" width="250" height="120" rx="20" />
          <rect x="370" y="40" width="250" height="120" rx="20" />
          <rect x="370" y="240" width="250" height="120" rx="20" />
          <rect x="20" y="240" width="250" height="120" rx="20" />
        </g>
        <g
          fill="currentColor"
          textAnchor="middle"
          fontFamily="inherit"
          fontSize="20"
        >
          <text x="145" y="80" fontWeight="700">
            1. Penguapan
          </text>
          <text x="145" y="112">
            Air cair → uap air
          </text>
          <text x="145" y="140" fontSize="17">
            Dibantu energi matahari
          </text>
          <text x="495" y="80" fontWeight="700">
            2. Kondensasi
          </text>
          <text x="495" y="112">
            Uap air mendingin
          </text>
          <text x="495" y="140" fontSize="17">
            Titik air membentuk awan
          </text>
          <text x="495" y="280" fontWeight="700">
            3. Hujan
          </text>
          <text x="495" y="312">
            Titik air membesar
          </text>
          <text x="495" y="340" fontSize="17">
            Air jatuh ke bumi
          </text>
          <text x="145" y="280" fontWeight="700">
            4. Aliran &amp; resapan
          </text>
          <text x="145" y="312">
            Ke sungai dan laut
          </text>
          <text x="145" y="340" fontSize="17">
            Sebagian meresap ke tanah
          </text>
          <text x="320" y="205" fontWeight="700">
            Siklus berulang
          </text>
        </g>
      </svg>
      <figcaption className="mt-3">
        Ikuti panah dari tahap 1 sampai 4, lalu kembali ke tahap 1. Diagram ini
        menyederhanakan perjalanan air.
      </figcaption>
      <ol className="mt-3 list-decimal pl-6 sm:hidden">
        <li>Penguapan: air cair menjadi uap dengan bantuan energi matahari.</li>
        <li>Kondensasi: uap mendingin menjadi titik air pembentuk awan.</li>
        <li>Hujan: air dari awan jatuh ke bumi.</li>
        <li>Air mengalir ke sungai dan laut atau meresap ke tanah.</li>
      </ol>
    </figure>
  );
}

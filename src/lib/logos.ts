// Central logo registry — uses unavatar.io (aggregates Clearbit + favicon)
// with a Google favicon fallback so nothing renders blank.

type LogoEntry = { src: string; srcDark?: string; alt: string };

const uav = (domain: string) =>
  `https://unavatar.io/${domain}?fallback=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fdomain%3D${domain}%26sz%3D128`;

const REGISTRY: Array<{ match: RegExp; logo: LogoEntry }> = [
  // Education
  { match: /iiit|naya raipur/i, logo: { src: uav("iiitnr.ac.in"), alt: "IIIT Naya Raipur" } },
  { match: /stanford/i, logo: { src: uav("stanford.edu"), alt: "Stanford University" } },

  // Experience
  { match: /intuit/i, logo: { src: uav("intuit.com"), alt: "Intuit" } },
  { match: /razorpay/i, logo: { src: uav("razorpay.com"), alt: "Razorpay" } },
  { match: /zeiss/i, logo: { src: uav("zeiss.com"), alt: "Zeiss" } },

  // Volunteer / Mentorship
  { match: /crio/i, logo: { src: uav("crio.do"), alt: "Crio.Do" } },
  { match: /geeksforgeeks|gfg/i, logo: { src: uav("geeksforgeeks.org"), alt: "GeeksforGeeks" } },
  { match: /heycoach/i, logo: { src: uav("heycoach.in"), alt: "HeyCoach" } },
  { match: /e-?cell/i, logo: { src: uav("iiitnr.ac.in"), alt: "E-Cell, IIIT Naya Raipur" } },
  { match: /comet/i, logo: { src: uav("iiitnr.ac.in"), alt: "ComET, IIIT Naya Raipur" } },

  // Certifications
  { match: /amazon|aws/i, logo: { src: uav("aws.amazon.com"), alt: "Amazon Web Services" } },
  { match: /deeplearning/i, logo: { src: uav("deeplearning.ai"), alt: "DeepLearning.AI" } },
];

export function getLogo(name: string): LogoEntry | null {
  if (!name) return null;
  for (const { match, logo } of REGISTRY) {
    if (match.test(name)) return logo;
  }
  return null;
}

export function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export interface HomeSection {
  id: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  ctaStyle?: 'primary' | 'outline';
  shapeType: 'text' | 'building' | 'network' | 'phone';
  alignment: 'left' | 'right';
}

export const homeSections: HomeSection[] = [
  {
    id: 'hero',
    title: 'PITCH STUDIO',
    description: 'We engineer the bridge between visionary founders and institutional capital through high-fidelity pitch sequences.',
    ctaText: 'START APPLICATION',
    ctaLink: '/forms',
    ctaStyle: 'primary',
    shapeType: 'text',
    alignment: 'left',
  },
  {
    id: 'about',
    title: 'The Studio',
    description: 'A venture acceleration platform built for the next generation of founders. We provide the infrastructure, tools, and investor network to transform raw concepts into fundable ventures.',
    ctaText: 'LEARN MORE',
    ctaLink: '/about',
    ctaStyle: 'outline',
    shapeType: 'building',
    alignment: 'right',
  },
  {
    id: 'what-we-do',
    title: 'What We Do',
    description: 'We deconstruct the fundraising process into a repeatable, data-driven sequence. Submit → Validate → Connect. No cold emails. No warm intros. Just signal.',
    ctaText: 'HOW IT WORKS',
    ctaLink: '/what-we-do',
    ctaStyle: 'outline',
    shapeType: 'network',
    alignment: 'left',
  },
  {
    id: 'contact',
    title: 'Get In Touch',
    description: 'Have a question about the platform? Want to partner with us? Drop us a message and our team will respond within 24 hours.',
    ctaText: 'CONTACT US',
    ctaLink: '/contact',
    ctaStyle: 'primary',
    shapeType: 'phone',
    alignment: 'right',
  },
];

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChessKing, faCrown, faGamepad, faRocket, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Pre-set Touch Down Hosting pricing cards shown on the Services tab. The
 * display order is controlled by the drag-and-drop ordering saved from the
 * Services page — these definitions are just the card contents.
 */
export interface PricingCard {
    id: string;
    name: string;
    price: string;
    per: string;
    icon: IconDefinition;
    tagline: string;
    features: string[];
    featured?: boolean;
}

export const pricingCards: PricingCard[] = [
    {
        id: 'rookie',
        name: 'Rookie',
        price: '$4.99',
        per: '/month',
        icon: faGamepad,
        tagline: 'Perfect for getting started.',
        features: ['2 GB RAM', '20 GB NVMe Storage', '1 vCPU Core', 'DDoS Protection', 'Community Support'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$9.99',
        per: '/month',
        icon: faRocket,
        tagline: 'For growing communities.',
        features: [
            '4 GB RAM',
            '40 GB NVMe Storage',
            '2 vCPU Cores',
            'DDoS Protection',
            'Daily Backups',
            'Priority Support',
        ],
        featured: true,
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '$19.99',
        per: '/month',
        icon: faShieldAlt,
        tagline: 'Serious power for serious servers.',
        features: [
            '8 GB RAM',
            '80 GB NVMe Storage',
            '4 vCPU Cores',
            'DDoS Protection',
            'Daily Backups',
            'Dedicated IP',
        ],
    },
    {
        id: 'legend',
        name: 'Legend',
        price: '$39.99',
        per: '/month',
        icon: faCrown,
        tagline: 'Top-tier performance, no compromises.',
        features: [
            '16 GB RAM',
            '160 GB NVMe Storage',
            '6 vCPU Cores',
            'DDoS Protection',
            'Hourly Backups',
            'Dedicated IP',
            '24/7 Support',
        ],
    },
    {
        id: 'hall-of-fame',
        name: 'Hall of Fame',
        price: '$79.99',
        per: '/month',
        icon: faChessKing,
        tagline: 'The absolute maximum. Bragging rights included.',
        features: [
            '32 GB RAM',
            '320 GB NVMe Storage',
            '8 vCPU Cores',
            'DDoS Protection',
            'Hourly Backups',
            'Dedicated IP',
            '24/7 Support',
            'White-Glove Migrations',
        ],
    },
];

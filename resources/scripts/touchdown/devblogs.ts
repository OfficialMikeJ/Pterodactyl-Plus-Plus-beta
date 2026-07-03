/**
 * Touch Down Hosting Dev-Blogs.
 *
 * This file is the ONLY place Dev-Blog content lives. The Dev-Blogs page in the
 * panel renders this list read-only — there is intentionally no way to add or
 * edit posts from inside the panel. To publish an update, edit this file and
 * rebuild the panel assets.
 */
export type DevBlogType = 'feature' | 'hotfix' | 'news';

export interface DevBlogPost {
    id: string;
    date: string;
    title: string;
    type: DevBlogType;
    tags: string[];
    paragraphs: string[];
}

export const devBlogPosts: DevBlogPost[] = [
    {
        id: 'welcome-to-touch-down-hosting',
        date: '2026-07-03',
        title: 'Welcome to Touch Down Hosting!',
        type: 'news',
        tags: ['launch', 'welcome'],
        paragraphs: [
            'Welcome to the brand new Touch Down Hosting panel! This is our custom-built control panel experience with a fully redesigned interface featuring our signature black, white and orange look with a glass morphism finish.',
            'From here you can manage your game servers, track your trophies and EXP, customize your panel theme, and keep up with everything we are working on — right on this page.',
            'Thanks for being here at kickoff. This is just the beginning.',
        ],
    },
    {
        id: 'trophy-system-launch',
        date: '2026-07-03',
        title: 'Trophy & EXP System is Live',
        type: 'feature',
        tags: ['trophies', 'exp', 'gamification'],
        paragraphs: [
            'The panel now has a full trophy and EXP system! Fifty trophies across Bronze, Silver, Gold and Platinum tiers are waiting to be earned for everyday actions — starting servers, saving files, creating backups, setting up schedules and much more.',
            'Every trophy grants EXP that raises your panel level. Earn all forty-nine standard trophies and the final Platinum "100% Club" trophy unlocks automatically.',
            'More trophies will be added over time — keep an eye on this page for announcements.',
        ],
    },
    {
        id: 'theming-system',
        date: '2026-07-03',
        title: 'Four Themes Out of the Box + Custom JSON Themes',
        type: 'feature',
        tags: ['themes', 'customization'],
        paragraphs: [
            'You can now reskin the entire panel from the palette icon in the navigation bar. Four themes ship out of the box: Cool Orange (the default), Cool Blue Ocean, Cool Green Mint and Cool Silk Purple.',
            'Panel owners can add fully custom themes at any time by dropping a .json theme file into the public/themes directory — no rebuild required. The theme picker discovers them automatically.',
        ],
    },
];

import http from '@/api/http';

/**
 * A Touch Down Hosting panel theme. Themes are plain JSON documents so new ones
 * can be dropped into `public/themes/*.json` at any time after installation.
 */
export interface TouchDownTheme {
    id: string;
    name: string;
    description?: string;
    author?: string;
    colors: {
        brand: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
        background: string;
        backgroundSolid: string;
        surface: string;
        surfaceStrong: string;
        surfaceBorder: string;
        glow: string;
        text: string;
        textMuted: string;
    };
}

const STORAGE_KEY = 'tdh-active-theme';

export const coolOrange: TouchDownTheme = {
    id: 'cool-orange',
    name: 'Cool Orange',
    description: 'The signature Touch Down Hosting look. Black, white and orange.',
    author: 'Touch Down Hosting',
    colors: {
        brand: {
            50: '#fff5eb',
            100: '#ffe8d1',
            200: '#ffd0a3',
            300: '#ffb266',
            400: '#ff9633',
            500: '#ff7a00',
            600: '#e56700',
            700: '#c65500',
            800: '#9a4200',
            900: '#7a3300',
        },
        background:
            'radial-gradient(1200px 800px at 85% -10%, rgba(255, 122, 0, 0.14), transparent 60%), radial-gradient(1000px 700px at -10% 110%, rgba(255, 122, 0, 0.09), transparent 55%), linear-gradient(160deg, #0a0b0d 0%, #101214 55%, #0d0b08 100%)',
        backgroundSolid: '#0c0d0f',
        surface: 'rgba(18, 20, 24, 0.6)',
        surfaceStrong: 'rgba(13, 15, 18, 0.82)',
        surfaceBorder: 'rgba(255, 255, 255, 0.09)',
        glow: 'rgba(255, 122, 0, 0.3)',
        text: '#f5f7fa',
        textMuted: '#9aa3ad',
    },
};

export const coolBlueOcean: TouchDownTheme = {
    id: 'cool-blue-ocean',
    name: 'Cool Blue Ocean',
    description: 'Deep sea blues with a cool, calm glass finish.',
    author: 'Touch Down Hosting',
    colors: {
        brand: {
            50: '#eff9ff',
            100: '#daf1ff',
            200: '#b3e3ff',
            300: '#75cdff',
            400: '#2cb2ff',
            500: '#0996f2',
            600: '#0077cf',
            700: '#005fa8',
            800: '#05508a',
            900: '#0a4372',
        },
        background:
            'radial-gradient(1200px 800px at 85% -10%, rgba(9, 150, 242, 0.16), transparent 60%), radial-gradient(1000px 700px at -10% 110%, rgba(9, 150, 242, 0.1), transparent 55%), linear-gradient(160deg, #05080d 0%, #0a1220 55%, #060b14 100%)',
        backgroundSolid: '#070c14',
        surface: 'rgba(13, 22, 34, 0.6)',
        surfaceStrong: 'rgba(8, 15, 25, 0.82)',
        surfaceBorder: 'rgba(163, 216, 255, 0.1)',
        glow: 'rgba(9, 150, 242, 0.3)',
        text: '#f2f8fd',
        textMuted: '#8fa5b8',
    },
};

export const coolGreenMint: TouchDownTheme = {
    id: 'cool-green-mint',
    name: 'Cool Green Mint',
    description: 'Fresh mint greens over a dark forest glass.',
    author: 'Touch Down Hosting',
    colors: {
        brand: {
            50: '#effef7',
            100: '#dafeee',
            200: '#b8fadd',
            300: '#81f4c3',
            400: '#43e5a0',
            500: '#1acd81',
            600: '#0fa968',
            700: '#108554',
            800: '#126945',
            900: '#11563a',
        },
        background:
            'radial-gradient(1200px 800px at 85% -10%, rgba(26, 205, 129, 0.14), transparent 60%), radial-gradient(1000px 700px at -10% 110%, rgba(26, 205, 129, 0.09), transparent 55%), linear-gradient(160deg, #060a08 0%, #0c1410 55%, #08100b 100%)',
        backgroundSolid: '#080e0b',
        surface: 'rgba(14, 24, 19, 0.6)',
        surfaceStrong: 'rgba(9, 17, 13, 0.82)',
        surfaceBorder: 'rgba(184, 250, 221, 0.09)',
        glow: 'rgba(26, 205, 129, 0.3)',
        text: '#f2fdf8',
        textMuted: '#8fb8a5',
    },
};

export const coolSilkPurple: TouchDownTheme = {
    id: 'cool-silk-purple',
    name: 'Cool Silk Purple',
    description: 'Silky royal purples wrapped in midnight glass.',
    author: 'Touch Down Hosting',
    colors: {
        brand: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
        },
        background:
            'radial-gradient(1200px 800px at 85% -10%, rgba(168, 85, 247, 0.15), transparent 60%), radial-gradient(1000px 700px at -10% 110%, rgba(168, 85, 247, 0.09), transparent 55%), linear-gradient(160deg, #0a070d 0%, #130f1c 55%, #0d0812 100%)',
        backgroundSolid: '#0d0a12',
        surface: 'rgba(22, 17, 30, 0.6)',
        surfaceStrong: 'rgba(15, 11, 21, 0.82)',
        surfaceBorder: 'rgba(233, 213, 255, 0.09)',
        glow: 'rgba(168, 85, 247, 0.3)',
        text: '#f8f5fc',
        textMuted: '#a396b3',
    },
};

export const builtInThemes: TouchDownTheme[] = [coolOrange, coolBlueOcean, coolGreenMint, coolSilkPurple];

/**
 * Applies a theme by writing its colors into the CSS custom properties that the
 * entire panel is styled against, then persists it so it survives reloads and
 * is available on the (unauthenticated) login screen.
 */
export const applyTheme = (theme: TouchDownTheme, persist = true): void => {
    const root = document.documentElement;

    Object.entries(theme.colors.brand).forEach(([shade, value]) => {
        root.style.setProperty(`--tdh-brand-${shade}`, value);
    });

    root.style.setProperty('--tdh-bg', theme.colors.background);
    root.style.setProperty('--tdh-bg-solid', theme.colors.backgroundSolid);
    root.style.setProperty('--tdh-surface', theme.colors.surface);
    root.style.setProperty('--tdh-surface-strong', theme.colors.surfaceStrong);
    root.style.setProperty('--tdh-surface-border', theme.colors.surfaceBorder);
    root.style.setProperty('--tdh-glow', theme.colors.glow);
    root.style.setProperty('--tdh-text', theme.colors.text);
    root.style.setProperty('--tdh-text-muted', theme.colors.textMuted);

    if (persist) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
        } catch {
            // Storage may be unavailable (private browsing); the theme still applies for this session.
        }
    }
};

export const getActiveThemeId = (): string => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return (JSON.parse(stored) as TouchDownTheme).id;
        }
    } catch {
        // fall through to default
    }

    return coolOrange.id;
};

/**
 * Re-applies the persisted theme (if any) as early as possible on page load.
 */
export const restoreTheme = (): void => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const theme = JSON.parse(stored) as TouchDownTheme;
        if (theme?.id && theme?.colors?.brand) {
            applyTheme(theme, false);
        }
    } catch {
        // Corrupt stored theme — fall back to the stylesheet defaults (Cool Orange).
    }
};

/**
 * Fetches all themes known to the panel: the built-in set plus any custom
 * `.json` themes dropped into `public/themes/`. Custom themes with the same id
 * as a built-in override it.
 */
export const fetchThemes = async (): Promise<TouchDownTheme[]> => {
    try {
        const { data } = await http.get('/api/client/themes');
        const remote: TouchDownTheme[] = data.data || [];
        const merged = new Map<string, TouchDownTheme>();

        builtInThemes.forEach((theme) => merged.set(theme.id, theme));
        remote.forEach((theme) => {
            if (theme?.id && theme?.colors?.brand) {
                merged.set(theme.id, theme);
            }
        });

        return Array.from(merged.values());
    } catch {
        return builtInThemes;
    }
};

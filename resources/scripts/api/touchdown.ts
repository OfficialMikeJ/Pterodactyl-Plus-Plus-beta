import http from '@/api/http';

export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Trophy {
    key: string;
    name: string;
    description: string;
    tier: TrophyTier;
    icon: string;
    exp: number;
    threshold: number;
    progress: number;
    earned: boolean;
    earnedAt: string | null;
}

export interface TrophyStanding {
    exp: number;
    level: number;
    currentLevelExp: number;
    nextLevelExp: number;
}

export interface UnseenTrophy {
    key: string;
    name: string;
    description: string;
    tier: TrophyTier;
    icon: string;
    exp: number;
}

export interface BillingConfig {
    enabled: boolean;
    order: string[];
    gateways: {
        stripe: { publishableKey: string; configured: boolean };
        paypal: { clientId: string; configured: boolean };
    };
}

export const getTrophies = async (): Promise<{ trophies: Trophy[]; standing: TrophyStanding }> => {
    const { data } = await http.get('/api/client/account/trophies');

    return {
        trophies: (data.data.trophies || []).map((t: any) => ({
            key: t.key,
            name: t.name,
            description: t.description,
            tier: t.tier,
            icon: t.icon,
            exp: t.exp,
            threshold: t.threshold,
            progress: t.progress,
            earned: t.earned,
            earnedAt: t.earned_at,
        })),
        standing: data.data.standing,
    };
};

export const getUnseenTrophies = async (): Promise<UnseenTrophy[]> => {
    const { data } = await http.get('/api/client/account/trophies/unseen');

    return data.data || [];
};

export const markTrophiesSeen = (): Promise<void> =>
    http.post('/api/client/account/trophies/seen').then(() => undefined);

const toBillingConfig = (data: any): BillingConfig => ({
    enabled: data.enabled,
    order: data.order || [],
    gateways: {
        stripe: {
            publishableKey: data.gateways?.stripe?.publishable_key || '',
            configured: data.gateways?.stripe?.configured || false,
        },
        paypal: {
            clientId: data.gateways?.paypal?.client_id || '',
            configured: data.gateways?.paypal?.configured || false,
        },
    },
});

export const getBillingConfig = async (): Promise<BillingConfig> => {
    const { data } = await http.get('/api/client/billing');

    return toBillingConfig(data.data);
};

export interface UpdateBillingSettings {
    enabled: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalClientId: string;
    paypalSecret: string;
}

export const updateBillingSettings = async (settings: UpdateBillingSettings): Promise<BillingConfig> => {
    const { data } = await http.put('/api/client/billing/settings', {
        enabled: settings.enabled,
        stripe_publishable_key: settings.stripePublishableKey,
        stripe_secret_key: settings.stripeSecretKey || null,
        paypal_client_id: settings.paypalClientId,
        paypal_secret: settings.paypalSecret || null,
    });

    return toBillingConfig(data.data);
};

export const updateBillingOrder = async (order: string[]): Promise<BillingConfig> => {
    const { data } = await http.put('/api/client/billing/order', { order });

    return toBillingConfig(data.data);
};

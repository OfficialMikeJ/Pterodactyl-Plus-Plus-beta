import React, { useEffect, useMemo, useState } from 'react';
import { Reorder } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faCreditCard,
    faExclamationTriangle,
    faGripLinesVertical,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import PageContentBlock from '@/components/elements/PageContentBlock';
import Spinner from '@/components/elements/Spinner';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import Switch from '@/components/elements/Switch';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import { BillingConfig, getBillingConfig, updateBillingOrder, updateBillingSettings } from '@/api/touchdown';
import { PricingCard, pricingCards } from '@/touchdown/pricing';

const Disclaimer = styled.div`
    ${tw`rounded-lg p-4 flex items-start mb-4`};
    background: rgba(255, 122, 0, 0.08);
    border: 1px solid var(--tdh-brand-600);
    color: var(--tdh-brand-200);
`;

const CardRow = styled.div`
    ${tw`flex items-stretch overflow-x-auto pb-4 -mx-1`};

    & > * {
        ${tw`mx-2 flex-shrink-0`};
    }
`;

const Card = styled.div<{ $featured?: boolean; $draggable?: boolean }>`
    ${tw`rounded-lg p-6 flex flex-col relative`};
    width: 16rem;
    background: var(--tdh-surface-strong);
    border: 1px solid ${(props) => (props.$featured ? 'var(--tdh-brand-500)' : 'var(--tdh-surface-border)')};
    backdrop-filter: blur(18px) saturate(155%);
    -webkit-backdrop-filter: blur(18px) saturate(155%);
    box-shadow: ${(props) =>
        props.$featured ? '0 8px 32px rgba(0,0,0,0.4), 0 0 22px var(--tdh-glow)' : '0 8px 32px rgba(0,0,0,0.35)'};
    ${(props) => props.$draggable && 'cursor: grab; &:active { cursor: grabbing; }'};
`;

const PriceTag = styled.div`
    ${tw`flex items-baseline mt-2`};

    & > span:first-of-type {
        ${tw`text-4xl font-bold`};
        color: var(--tdh-brand-400);
    }

    & > span:last-of-type {
        ${tw`text-sm ml-1`};
        color: var(--tdh-text-muted);
    }
`;

interface CardContentProps {
    card: PricingCard;
    draggable: boolean;
}

const CardContent = ({ card, draggable }: CardContentProps) => (
    <>
        {draggable && (
            <div css={tw`absolute top-2 right-3`} style={{ color: 'var(--tdh-text-muted)' }}>
                <FontAwesomeIcon icon={faGripLinesVertical} />
            </div>
        )}
        {card.featured && (
            <span
                css={tw`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-widest rounded-full px-3 py-1 bg-white font-bold whitespace-nowrap`}
                style={{ color: 'var(--tdh-brand-600)' }}
            >
                Most Popular
            </span>
        )}
        <div css={tw`text-3xl`} style={{ color: 'var(--tdh-brand-500)' }}>
            <FontAwesomeIcon icon={card.icon} />
        </div>
        <h3 css={tw`text-xl font-semibold mt-3`} style={{ color: 'var(--tdh-text)' }}>
            {card.name}
        </h3>
        <p css={tw`text-xs mt-1`} style={{ color: 'var(--tdh-text-muted)' }}>
            {card.tagline}
        </p>
        <PriceTag>
            <span>{card.price}</span>
            <span>{card.per}</span>
        </PriceTag>
        <ul css={tw`mt-4 flex-1`}>
            {card.features.map((feature) => (
                <li key={feature} css={tw`text-sm py-1`} style={{ color: 'var(--tdh-text)' }}>
                    <FontAwesomeIcon icon={faCheck} css={tw`mr-2`} style={{ color: 'var(--tdh-brand-400)' }} />
                    {feature}
                </li>
            ))}
        </ul>
        <Button color={card.featured ? 'primary' : 'white'} css={tw`mt-4`} onClick={(e) => e.preventDefault()}>
            Choose {card.name}
        </Button>
    </>
);

const orderedCards = (order: string[]): PricingCard[] => {
    const byId = new Map(pricingCards.map((card) => [card.id, card]));
    const ordered: PricingCard[] = [];

    order.forEach((id) => {
        const card = byId.get(id);
        if (card) {
            ordered.push(card);
            byId.delete(id);
        }
    });

    // Any cards not present in the saved order keep their default position at the end.
    byId.forEach((card) => ordered.push(card));

    return ordered;
};

const ServicesContainer = () => {
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const [config, setConfig] = useState<BillingConfig | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [order, setOrder] = useState<string[]>([]);
    const [stripePublishableKey, setStripePublishableKey] = useState('');
    const [stripeSecretKey, setStripeSecretKey] = useState('');
    const [paypalClientId, setPaypalClientId] = useState('');
    const [paypalSecret, setPaypalSecret] = useState('');
    const [savingSettings, setSavingSettings] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    useEffect(() => {
        clearFlashes('services');
        getBillingConfig()
            .then((config) => {
                setConfig(config);
                setEnabled(config.enabled);
                setOrder(orderedCards(config.order).map((card) => card.id));
                setStripePublishableKey(config.gateways.stripe.publishableKey);
                setPaypalClientId(config.gateways.paypal.clientId);
            })
            .catch((error) => clearAndAddHttpError({ key: 'services', error }));
    }, []);

    const cards = useMemo(() => orderedCards(order), [order]);
    const canDrag = rootAdmin && enabled;

    const onSaveSettings = () => {
        setSavingSettings(true);
        clearFlashes('services');

        updateBillingSettings({ enabled, stripePublishableKey, stripeSecretKey, paypalClientId, paypalSecret })
            .then((config) => {
                setConfig(config);
                setStripeSecretKey('');
                setPaypalSecret('');
                addFlash({ key: 'services', type: 'success', message: 'Service settings have been saved.' });
            })
            .catch((error) => clearAndAddHttpError({ key: 'services', error }))
            .finally(() => setSavingSettings(false));
    };

    const onSaveOrder = () => {
        setSavingOrder(true);
        clearFlashes('services');

        updateBillingOrder(order)
            .then((config) => {
                setConfig(config);
                addFlash({ key: 'services', type: 'success', message: 'Pricing card order has been saved.' });
            })
            .catch((error) => clearAndAddHttpError({ key: 'services', error }))
            .finally(() => setSavingOrder(false));
    };

    if (!config) {
        return (
            <PageContentBlock title={'Services'}>
                <Spinner size={'large'} centered />
            </PageContentBlock>
        );
    }

    return (
        <PageContentBlock title={'Services'}>
            <FlashMessageRender byKey={'services'} css={tw`mb-4`} />
            <h1 css={tw`text-2xl font-semibold mb-4`}>
                <FontAwesomeIcon icon={faCreditCard} style={{ color: 'var(--tdh-brand-500)' }} css={tw`mr-3`} />
                Services &amp; Billing
            </h1>
            {rootAdmin ? (
                <>
                    <TitledGreyBox title={'Service Status'} icon={faCreditCard}>
                        <Disclaimer>
                            <FontAwesomeIcon icon={faExclamationTriangle} css={tw`mr-3 mt-1 flex-shrink-0`} />
                            <p css={tw`text-sm`} style={{ color: 'inherit' }}>
                                Touch Down Hosting devs are not responsible for any loss of revenue, Stolen or leaked
                                API Keys or credentials - Please keep your API keys and Credentials safe and secure at
                                all times
                            </p>
                        </Disclaimer>
                        <Switch
                            name={'services_enabled'}
                            label={'Enable Services'}
                            description={
                                'Turns on the Services storefront and links the panel to your configured payment gateways. This is OFF by default.'
                            }
                            defaultChecked={config.enabled}
                            onChange={(e) => setEnabled(e.currentTarget.checked)}
                        />
                    </TitledGreyBox>
                    <div css={tw`grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6`}>
                        <TitledGreyBox title={'Stripe'} icon={faLock}>
                            <div>
                                <Label>Publishable Key</Label>
                                <Input
                                    value={stripePublishableKey}
                                    placeholder={'pk_live_...'}
                                    onChange={(e) => setStripePublishableKey(e.currentTarget.value)}
                                />
                            </div>
                            <div css={tw`mt-4`}>
                                <Label>Secret Key</Label>
                                <Input
                                    type={'password'}
                                    value={stripeSecretKey}
                                    placeholder={
                                        config.gateways.stripe.configured
                                            ? 'A secret key is saved — enter a new one to replace it.'
                                            : 'sk_live_...'
                                    }
                                    onChange={(e) => setStripeSecretKey(e.currentTarget.value)}
                                />
                                <p className={'input-help'}>Stored encrypted. Leave blank to keep the current key.</p>
                            </div>
                        </TitledGreyBox>
                        <TitledGreyBox title={'PayPal'} icon={faLock}>
                            <div>
                                <Label>Client ID</Label>
                                <Input
                                    value={paypalClientId}
                                    placeholder={'PayPal REST client ID'}
                                    onChange={(e) => setPaypalClientId(e.currentTarget.value)}
                                />
                            </div>
                            <div css={tw`mt-4`}>
                                <Label>Client Secret</Label>
                                <Input
                                    type={'password'}
                                    value={paypalSecret}
                                    placeholder={
                                        config.gateways.paypal.configured
                                            ? 'A secret is saved — enter a new one to replace it.'
                                            : 'PayPal REST client secret'
                                    }
                                    onChange={(e) => setPaypalSecret(e.currentTarget.value)}
                                />
                                <p className={'input-help'}>
                                    Stored encrypted. Leave blank to keep the current secret.
                                </p>
                            </div>
                        </TitledGreyBox>
                    </div>
                    <div css={tw`flex justify-end mt-6`}>
                        <Button isLoading={savingSettings} disabled={savingSettings} onClick={onSaveSettings}>
                            Save Service Settings
                        </Button>
                    </div>
                    <div css={tw`mt-10`}>
                        <div css={tw`flex items-center justify-between flex-wrap mb-4`}>
                            <h2 css={tw`text-xl font-semibold`}>Pricing Cards</h2>
                            <p css={tw`text-xs`} style={{ color: 'var(--tdh-text-muted)' }}>
                                {canDrag
                                    ? 'Drag the cards left or right to reorder them, then press Save Order.'
                                    : 'Enable Services to unlock drag-to-reorder.'}
                            </p>
                        </div>
                        {canDrag ? (
                            <Reorder.Group
                                axis={'x'}
                                values={order}
                                onReorder={setOrder}
                                as={'div'}
                                css={tw`flex items-stretch overflow-x-auto pb-4`}
                            >
                                {cards.map((card) => (
                                    <Reorder.Item key={card.id} value={card.id} as={'div'} css={tw`mx-2 flex-shrink-0`}>
                                        <Card $featured={card.featured} $draggable>
                                            <CardContent card={card} draggable />
                                        </Card>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        ) : (
                            <CardRow>
                                {cards.map((card) => (
                                    <Card key={card.id} $featured={card.featured}>
                                        <CardContent card={card} draggable={false} />
                                    </Card>
                                ))}
                            </CardRow>
                        )}
                        {canDrag && (
                            <div css={tw`flex justify-end mt-2`}>
                                <Button isLoading={savingOrder} disabled={savingOrder} onClick={onSaveOrder}>
                                    Save Order
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            ) : config.enabled ? (
                <CardRow>
                    {cards.map((card) => (
                        <Card key={card.id} $featured={card.featured}>
                            <CardContent card={card} draggable={false} />
                        </Card>
                    ))}
                </CardRow>
            ) : (
                <TitledGreyBox title={'Services'} icon={faCreditCard}>
                    <p css={tw`text-sm`} style={{ color: 'var(--tdh-text-muted)' }}>
                        Services are not enabled on this panel yet. Check back soon!
                    </p>
                </TitledGreyBox>
            )}
        </PageContentBlock>
    );
};

export default ServicesContainer;

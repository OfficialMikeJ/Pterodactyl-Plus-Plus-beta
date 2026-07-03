import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCreditCard,
    faInfoCircle,
    faNewspaper,
    faPalette,
    faShieldAlt,
    faTachometerAlt,
    faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import PageContentBlock from '@/components/elements/PageContentBlock';
import BrandLogo from '@/components/touchdown/BrandLogo';
import Button from '@/components/elements/Button';

const Hero = styled.div`
    ${tw`rounded-lg p-10 flex flex-col items-center text-center`};
    background: var(--tdh-surface-strong);
    border: 1px solid var(--tdh-surface-border);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45), 0 0 28px var(--tdh-glow);
`;

const FeatureCard = styled.div`
    ${tw`rounded-lg p-5 flex items-start`};
    background: var(--tdh-surface);
    border: 1px solid var(--tdh-surface-border);
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);

    &:hover {
        border-color: var(--tdh-brand-500);
        box-shadow: 0 0 16px var(--tdh-glow);
    }
`;

const features: { icon: IconDefinition; title: string; body: string }[] = [
    {
        icon: faTachometerAlt,
        title: 'High-Performance Game Hosting',
        body: 'Servers managed through a fast, modern control panel built on battle-tested Pterodactyl technology.',
    },
    {
        icon: faTrophy,
        title: 'Trophies & EXP',
        body: 'Earn 50 trophies across Bronze, Silver, Gold and Platinum tiers just by using the panel — level up as you go.',
    },
    {
        icon: faPalette,
        title: 'Custom Themes',
        body: 'Four themes out of the box and support for unlimited custom JSON themes, switchable at any time.',
    },
    {
        icon: faShieldAlt,
        title: 'Secure by Design',
        body: 'Two-factor authentication, encrypted gateway credentials and a security-first configuration.',
    },
];

const AboutContainer = () => (
    <PageContentBlock title={'About Touch Down Hosting'}>
        <Hero>
            <BrandLogo variant={'splash'} />
            <h1 css={tw`text-3xl font-bold mt-6`} style={{ color: 'var(--tdh-text)' }}>
                About <span style={{ color: 'var(--tdh-brand-500)' }}>Touch Down Hosting</span>
            </h1>
            <p css={tw`text-sm mt-4 max-w-2xl leading-relaxed`} style={{ color: 'var(--tdh-text-muted)' }}>
                Touch Down Hosting is a game server hosting platform built for players, by players. Our fully custom
                panel — black, white and orange with a signature glass finish — puts everything you need to run your
                servers in one place: powerful management tools, achievements to chase, themes to make it yours, and a
                direct line to everything we are building next.
            </p>
            <div css={tw`flex flex-wrap justify-center mt-6`}>
                <Link to={'/dev-blogs'} css={tw`no-underline m-1`}>
                    <Button color={'white'}>
                        <FontAwesomeIcon icon={faNewspaper} css={tw`mr-2`} />
                        Read the Dev-Blogs
                    </Button>
                </Link>
                <Link to={'/services'} css={tw`no-underline m-1`}>
                    <Button>
                        <FontAwesomeIcon icon={faCreditCard} css={tw`mr-2`} />
                        View Services
                    </Button>
                </Link>
            </div>
        </Hero>
        <div css={tw`grid gap-4 grid-cols-1 md:grid-cols-2 mt-8`}>
            {features.map((feature) => (
                <FeatureCard key={feature.title}>
                    <div css={tw`text-2xl mr-4 mt-1`} style={{ color: 'var(--tdh-brand-500)' }}>
                        <FontAwesomeIcon icon={feature.icon} />
                    </div>
                    <div>
                        <h3 css={tw`font-semibold`} style={{ color: 'var(--tdh-text)' }}>
                            {feature.title}
                        </h3>
                        <p css={tw`text-sm mt-1`} style={{ color: 'var(--tdh-text-muted)' }}>
                            {feature.body}
                        </p>
                    </div>
                </FeatureCard>
            ))}
        </div>
        <p css={tw`text-center text-xs mt-8`} style={{ color: 'var(--tdh-text-muted)' }}>
            <FontAwesomeIcon icon={faInfoCircle} css={tw`mr-2`} />
            Touch Down Hosting panel &mdash; based on Pterodactyl 1.14.1
        </p>
    </PageContentBlock>
);

export default AboutContainer;

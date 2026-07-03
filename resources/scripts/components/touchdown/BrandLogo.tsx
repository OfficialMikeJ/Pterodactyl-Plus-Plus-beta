import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

export type BrandLogoVariant = 'nav' | 'login' | 'splash';

interface Props {
    variant?: BrandLogoVariant;
    className?: string;
}

/**
 * Maximum rendered height for each slot the logo can appear in. The image
 * itself auto-scales: whatever resolution the uploaded PNG is, it is contained
 * within these bounds while preserving its aspect ratio.
 */
const maxHeights: Record<BrandLogoVariant, string> = {
    nav: '2.5rem',
    login: '7.5rem',
    splash: '10rem',
};

const Image = styled.img<{ $variant: BrandLogoVariant }>`
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: ${(props) => maxHeights[props.$variant]};
    object-fit: contain;
    user-select: none;
`;

const FallbackText = styled.span<{ $variant: BrandLogoVariant }>`
    ${tw`font-header font-semibold tracking-wide whitespace-nowrap`};
    color: var(--tdh-text);
    font-size: ${(props) => (props.$variant === 'nav' ? '1.375rem' : props.$variant === 'login' ? '2rem' : '2.5rem')};

    & > span {
        color: var(--tdh-brand-500);
    }
`;

/**
 * Renders the Touch Down Hosting brand logo from /logo.png (drop any PNG into
 * the panel's public directory and it is picked up automatically, auto-sized
 * to fit the slot it renders in). Falls back to styled text if no logo file
 * has been uploaded yet.
 */
const BrandLogo = ({ variant = 'nav', className }: Props) => {
    const [failed, setFailed] = useState(false);
    const name = useStoreState((state) => state.settings.data?.name) || 'Touch Down Hosting';

    if (failed) {
        const parts = name.split(' ');

        return (
            <FallbackText $variant={variant} className={className}>
                {parts.slice(0, -1).join(' ') || name} {parts.length > 1 && <span>{parts[parts.length - 1]}</span>}
            </FallbackText>
        );
    }

    return (
        <Image
            $variant={variant}
            className={className}
            src={'/logo.png'}
            alt={name}
            draggable={false}
            onError={() => setFailed(true)}
        />
    );
};

export default BrandLogo;

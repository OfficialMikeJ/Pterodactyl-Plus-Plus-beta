import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import BrandLogo from '@/components/touchdown/BrandLogo';

interface Props {
    /** Called when the splash sequence has finished and the app should transition onwards. */
    onComplete: () => void;
    /** Total time the splash is displayed before transitioning, in milliseconds. */
    duration?: number;
}

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
        filter: drop-shadow(0 0 14px var(--tdh-glow));
    }
    50% {
        transform: scale(1.08);
        filter: drop-shadow(0 0 42px var(--tdh-glow));
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0 0 14px var(--tdh-glow));
    }
`;

const dotBlink = keyframes`
    0%, 80%, 100% { opacity: 0.25; }
    40% { opacity: 1; }
`;

const Overlay = styled.div`
    ${tw`fixed inset-0 flex flex-col items-center justify-center select-none`};
    z-index: 9999;
    background: var(--tdh-bg-solid);
    background-image: var(--tdh-bg);
    background-size: cover;
    animation: ${fadeIn} 350ms ease-out both;
`;

const PulsingLogo = styled.div`
    animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Dots = styled.div`
    ${tw`flex items-center justify-center mt-8`};

    & > span {
        ${tw`inline-block w-2 h-2 rounded-full mx-1`};
        background: var(--tdh-brand-500);
        animation: ${dotBlink} 1.4s infinite both;

        &:nth-child(2) {
            animation-delay: 0.2s;
        }

        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
`;

/**
 * Full-screen pulsating logo sequence shown after a successful login, holding
 * for a moment before transitioning the user into the dashboard.
 */
const LoginSplash = ({ onComplete, duration = 2600 }: Props) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, duration);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Overlay>
            <PulsingLogo>
                <BrandLogo variant={'splash'} />
            </PulsingLogo>
            <Dots>
                <span />
                <span />
                <span />
            </Dots>
        </Overlay>
    );
};

export default LoginSplash;

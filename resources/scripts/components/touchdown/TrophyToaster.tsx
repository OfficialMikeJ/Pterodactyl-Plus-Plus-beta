import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { getUnseenTrophies, markTrophiesSeen, UnseenTrophy } from '@/api/touchdown';
import { tierColors, tierNames, trophyIcon } from '@/touchdown/icons';

const POLL_INTERVAL = 30000;
const TOAST_LIFETIME = 6000;

const ToastStack = styled.div`
    ${tw`fixed bottom-0 right-0 p-4 flex flex-col items-end`};
    z-index: 9990;
    pointer-events: none;
`;

const Toast = styled(motion.div)<{ $tier: string }>`
    ${tw`flex items-center rounded-lg p-4 mt-3`};
    pointer-events: auto;
    min-width: 20rem;
    max-width: 24rem;
    background: var(--tdh-surface-strong);
    border: 1px solid ${(props) => props.$tier};
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px var(--tdh-glow);
`;

const TrophyBadge = styled.div<{ $color: string }>`
    ${tw`flex items-center justify-center rounded-full flex-shrink-0 mr-4`};
    width: 3rem;
    height: 3rem;
    color: ${(props) => props.$color};
    background: rgba(255, 255, 255, 0.07);
    border: 2px solid ${(props) => props.$color};
    box-shadow: 0 0 14px ${(props) => props.$color}66;
`;

/**
 * Global trophy toast notifications. Polls the panel for freshly earned
 * (unseen) trophies and pops them up as toasts in the bottom-right corner.
 */
const TrophyToaster = () => {
    const authenticated = useStoreState((state) => !!state.user.data);
    const [visible, setVisible] = useState<UnseenTrophy[]>([]);
    const timers = useRef<number[]>([]);

    const dismiss = (key: string) => setVisible((current) => current.filter((t) => t.key !== key));

    useEffect(() => {
        if (!authenticated) return;

        const check = () => {
            getUnseenTrophies()
                .then((unseen) => {
                    if (unseen.length === 0) return;

                    // Mark as seen immediately so other tabs/refreshes don't re-toast them.
                    markTrophiesSeen().catch(() => undefined);

                    setVisible((current) => {
                        const existing = new Set(current.map((t) => t.key));
                        return [...current, ...unseen.filter((t) => !existing.has(t.key))];
                    });

                    unseen.forEach((trophy) => {
                        timers.current.push(window.setTimeout(() => dismiss(trophy.key), TOAST_LIFETIME));
                    });
                })
                .catch(() => undefined);
        };

        check();
        const interval = window.setInterval(check, POLL_INTERVAL);

        return () => {
            window.clearInterval(interval);
            timers.current.forEach((t) => window.clearTimeout(t));
        };
    }, [authenticated]);

    if (!authenticated) return null;

    return (
        <ToastStack>
            <AnimatePresence>
                {visible.map((trophy) => (
                    <Toast
                        key={trophy.key}
                        $tier={tierColors[trophy.tier]}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={() => dismiss(trophy.key)}
                    >
                        <TrophyBadge $color={tierColors[trophy.tier]}>
                            <FontAwesomeIcon icon={trophyIcon(trophy.icon)} size={'lg'} />
                        </TrophyBadge>
                        <div css={tw`flex-1 min-w-0`}>
                            <p css={tw`text-xs uppercase tracking-widest`} style={{ color: tierColors[trophy.tier] }}>
                                {tierNames[trophy.tier]} Trophy Earned!
                            </p>
                            <p css={tw`font-semibold`} style={{ color: 'var(--tdh-text)' }}>
                                {trophy.name}
                            </p>
                            <p css={tw`text-xs truncate`} style={{ color: 'var(--tdh-text-muted)' }}>
                                {trophy.description}
                            </p>
                        </div>
                        <div css={tw`ml-3 text-sm font-bold flex-shrink-0`} style={{ color: 'var(--tdh-brand-400)' }}>
                            +{trophy.exp} EXP
                        </div>
                    </Toast>
                ))}
            </AnimatePresence>
        </ToastStack>
    );
};

export default TrophyToaster;

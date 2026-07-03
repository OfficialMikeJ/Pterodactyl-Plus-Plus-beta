import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import PageContentBlock from '@/components/elements/PageContentBlock';
import Spinner from '@/components/elements/Spinner';
import { getTrophies, Trophy, TrophyStanding, TrophyTier } from '@/api/touchdown';
import { tierColors, tierNames, trophyIcon } from '@/touchdown/icons';

const Header = styled.div`
    ${tw`rounded-lg p-6 flex flex-col sm:flex-row sm:items-center`};
    background: var(--tdh-surface-strong);
    border: 1px solid var(--tdh-surface-border);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
`;

const LevelRing = styled.div`
    ${tw`flex flex-col items-center justify-center rounded-full flex-shrink-0 mx-auto sm:mx-0 sm:mr-8`};
    width: 6.5rem;
    height: 6.5rem;
    border: 3px solid var(--tdh-brand-500);
    box-shadow: 0 0 24px var(--tdh-glow), inset 0 0 18px var(--tdh-glow);
`;

const ExpBar = styled.div`
    ${tw`w-full rounded-full overflow-hidden mt-2`};
    height: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--tdh-surface-border);

    & > div {
        ${tw`h-full rounded-full transition-all duration-500`};
        background: linear-gradient(90deg, var(--tdh-brand-600), var(--tdh-brand-400));
        box-shadow: 0 0 12px var(--tdh-glow);
    }
`;

const Card = styled.div<{ $earned: boolean; $tier: TrophyTier }>`
    ${tw`rounded-lg p-4 flex items-start transition-all duration-150`};
    background: var(--tdh-surface);
    border: 1px solid ${(props) => (props.$earned ? tierColors[props.$tier] : 'var(--tdh-surface-border)')};
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    opacity: ${(props) => (props.$earned ? 1 : 0.65)};

    &:hover {
        opacity: 1;
        box-shadow: 0 0 16px ${(props) => (props.$earned ? `${tierColors[props.$tier]}55` : 'var(--tdh-glow)')};
    }
`;

const CardIcon = styled.div<{ $earned: boolean; $tier: TrophyTier }>`
    ${tw`flex items-center justify-center rounded-full flex-shrink-0 mr-4`};
    width: 3rem;
    height: 3rem;
    color: ${(props) => (props.$earned ? tierColors[props.$tier] : 'var(--tdh-text-muted)')};
    background: rgba(255, 255, 255, 0.06);
    border: 2px solid ${(props) => (props.$earned ? tierColors[props.$tier] : 'var(--tdh-surface-border)')};
    ${(props) => props.$earned && `box-shadow: 0 0 12px ${tierColors[props.$tier]}55;`};
`;

const MiniProgress = styled.div`
    ${tw`w-full rounded-full overflow-hidden mt-2`};
    height: 0.375rem;
    background: rgba(255, 255, 255, 0.08);

    & > div {
        ${tw`h-full rounded-full`};
        background: var(--tdh-brand-500);
    }
`;

const tiers: TrophyTier[] = ['bronze', 'silver', 'gold', 'platinum'];

const TrophiesContainer = () => {
    const [trophies, setTrophies] = useState<Trophy[] | null>(null);
    const [standing, setStanding] = useState<TrophyStanding | null>(null);

    useEffect(() => {
        getTrophies()
            .then(({ trophies, standing }) => {
                setTrophies(trophies);
                setStanding(standing);
            })
            .catch(console.error);
    }, []);

    if (!trophies || !standing) {
        return (
            <PageContentBlock title={'Trophies'}>
                <Spinner size={'large'} centered />
            </PageContentBlock>
        );
    }

    const earnedCount = trophies.filter((t) => t.earned).length;
    const levelSpan = standing.nextLevelExp - standing.currentLevelExp;
    const intoLevel = standing.exp - standing.currentLevelExp;
    const percent = levelSpan > 0 ? Math.min(100, Math.round((intoLevel / levelSpan) * 100)) : 100;

    return (
        <PageContentBlock title={'Trophies'}>
            <Header>
                <LevelRing>
                    <span css={tw`text-xs uppercase tracking-widest`} style={{ color: 'var(--tdh-text-muted)' }}>
                        Level
                    </span>
                    <span css={tw`text-4xl font-bold`} style={{ color: 'var(--tdh-brand-400)' }}>
                        {standing.level}
                    </span>
                </LevelRing>
                <div css={tw`flex-1 mt-4 sm:mt-0`}>
                    <div css={tw`flex items-center justify-between flex-wrap`}>
                        <h1 css={tw`text-2xl font-semibold`}>
                            <FontAwesomeIcon icon={faTrophy} style={{ color: 'var(--tdh-brand-500)' }} css={tw`mr-3`} />
                            Trophy Room
                        </h1>
                        <p css={tw`text-sm`} style={{ color: 'var(--tdh-text-muted)' }}>
                            <FontAwesomeIcon icon={faStar} style={{ color: 'var(--tdh-brand-400)' }} css={tw`mr-1`} />
                            {standing.exp} EXP total &mdash; {earnedCount} / {trophies.length} trophies earned
                        </p>
                    </div>
                    <ExpBar>
                        <div style={{ width: `${percent}%` }} />
                    </ExpBar>
                    <p css={tw`text-xs mt-1`} style={{ color: 'var(--tdh-text-muted)' }}>
                        {intoLevel} / {levelSpan} EXP to level {standing.level + 1}
                    </p>
                    <div css={tw`flex flex-wrap mt-3`}>
                        {tiers.map((tier) => (
                            <span
                                key={tier}
                                css={tw`text-xs uppercase tracking-wider rounded-full px-3 py-1 mr-2 mt-1`}
                                style={{
                                    color: tierColors[tier],
                                    border: `1px solid ${tierColors[tier]}`,
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                {tierNames[tier]}: {trophies.filter((t) => t.tier === tier && t.earned).length} /{' '}
                                {trophies.filter((t) => t.tier === tier).length}
                            </span>
                        ))}
                    </div>
                </div>
            </Header>
            {tiers.map((tier) => (
                <div key={tier} css={tw`mt-8`}>
                    <h2 css={tw`text-lg uppercase tracking-widest mb-4`} style={{ color: tierColors[tier] }}>
                        <FontAwesomeIcon icon={faTrophy} css={tw`mr-2`} />
                        {tierNames[tier]}
                    </h2>
                    <div css={tw`grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3`}>
                        {trophies
                            .filter((t) => t.tier === tier)
                            .map((trophy) => (
                                <Card key={trophy.key} $earned={trophy.earned} $tier={trophy.tier}>
                                    <CardIcon $earned={trophy.earned} $tier={trophy.tier}>
                                        <FontAwesomeIcon icon={trophyIcon(trophy.icon)} />
                                    </CardIcon>
                                    <div css={tw`flex-1 min-w-0`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            <p css={tw`font-semibold truncate`} style={{ color: 'var(--tdh-text)' }}>
                                                {trophy.name}
                                            </p>
                                            <span
                                                css={tw`text-xs font-bold ml-2 flex-shrink-0`}
                                                style={{ color: 'var(--tdh-brand-400)' }}
                                            >
                                                +{trophy.exp} EXP
                                            </span>
                                        </div>
                                        <p css={tw`text-xs mt-1`} style={{ color: 'var(--tdh-text-muted)' }}>
                                            {trophy.description}
                                        </p>
                                        {!trophy.earned && trophy.threshold > 1 && (
                                            <>
                                                <MiniProgress>
                                                    <div
                                                        style={{
                                                            width: `${Math.round(
                                                                (trophy.progress / trophy.threshold) * 100
                                                            )}%`,
                                                        }}
                                                    />
                                                </MiniProgress>
                                                <p css={tw`text-xs mt-1`} style={{ color: 'var(--tdh-text-muted)' }}>
                                                    {trophy.progress} / {trophy.threshold}
                                                </p>
                                            </>
                                        )}
                                        {trophy.earned && trophy.earnedAt && (
                                            <p css={tw`text-xs mt-1`} style={{ color: tierColors[trophy.tier] }}>
                                                Earned {new Date(trophy.earnedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
        </PageContentBlock>
    );
};

export default TrophiesContainer;

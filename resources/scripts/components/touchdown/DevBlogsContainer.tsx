import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faNewspaper, faRocket, faWrench } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { DevBlogType, devBlogPosts } from '@/touchdown/devblogs';

const typeMeta: Record<DevBlogType, { label: string; icon: IconDefinition; color: string }> = {
    feature: { label: 'New Feature', icon: faRocket, color: 'var(--tdh-brand-400)' },
    hotfix: { label: 'Hotfix', icon: faWrench, color: '#f87171' },
    news: { label: 'News', icon: faBullhorn, color: '#ffffff' },
};

const Post = styled.article`
    ${tw`rounded-lg p-6 mt-6`};
    background: var(--tdh-surface);
    border: 1px solid var(--tdh-surface-border);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);

    &:hover {
        border-color: var(--tdh-brand-600);
    }
`;

const TypeBadge = styled.span<{ $color: string }>`
    ${tw`inline-flex items-center text-xs uppercase tracking-widest rounded-full px-3 py-1 font-bold`};
    color: ${(props) => props.$color};
    border: 1px solid ${(props) => props.$color};
    background: rgba(255, 255, 255, 0.04);
`;

const Tag = styled.span`
    ${tw`inline-block text-xs rounded-full px-2 py-1 mr-2 mt-2`};
    color: var(--tdh-text-muted);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--tdh-surface-border);
`;

/**
 * The Dev-Blogs page renders the hardcoded post list from
 * `resources/scripts/touchdown/devblogs.ts` and is intentionally read-only —
 * there is no in-panel way to create, edit or remove posts.
 */
const DevBlogsContainer = () => (
    <PageContentBlock title={'Dev-Blogs'}>
        <div css={tw`flex items-center justify-between flex-wrap`}>
            <h1 css={tw`text-2xl font-semibold`}>
                <FontAwesomeIcon icon={faNewspaper} style={{ color: 'var(--tdh-brand-500)' }} css={tw`mr-3`} />
                Dev-Blogs
            </h1>
            <p css={tw`text-xs`} style={{ color: 'var(--tdh-text-muted)' }}>
                Official Touch Down Hosting updates — new features, hotfixes and news.
            </p>
        </div>
        {devBlogPosts.map((post) => {
            const meta = typeMeta[post.type];

            return (
                <Post key={post.id}>
                    <div css={tw`flex items-center justify-between flex-wrap`}>
                        <TypeBadge $color={meta.color}>
                            <FontAwesomeIcon icon={meta.icon} css={tw`mr-2`} />
                            {meta.label}
                        </TypeBadge>
                        <time css={tw`text-xs`} style={{ color: 'var(--tdh-text-muted)' }}>
                            {new Date(`${post.date}T00:00:00`).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                    <h2 css={tw`text-xl font-semibold mt-3`} style={{ color: 'var(--tdh-text)' }}>
                        {post.title}
                    </h2>
                    {post.paragraphs.map((paragraph, index) => (
                        <p key={index} css={tw`text-sm mt-3 leading-relaxed`} style={{ color: 'var(--tdh-text)' }}>
                            {paragraph}
                        </p>
                    ))}
                    <div>
                        {post.tags.map((tag) => (
                            <Tag key={tag}>#{tag}</Tag>
                        ))}
                    </div>
                </Post>
            );
        })}
    </PageContentBlock>
);

export default DevBlogsContainer;

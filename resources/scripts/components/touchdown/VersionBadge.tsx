import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Badge = styled(Link)`
    ${tw`inline-flex items-center no-underline rounded-full ml-3 px-3 py-1 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-150`};
    border: 1px solid var(--tdh-brand-500);
    background: rgba(255, 122, 0, 0.1);
    color: var(--tdh-brand-400);

    &:hover {
        background: linear-gradient(135deg, var(--tdh-brand-500) 0%, var(--tdh-brand-600) 100%);
        color: #ffffff;
        box-shadow: 0 0 14px var(--tdh-glow);
    }

    & > span {
        ${tw`ml-1 font-medium normal-case`};
    }
`;

/**
 * Clickable build tag shown in the navigation bar. The public build wears the
 * ALPHA tag; the internal build wears DEV. Clicking it opens the Dev-Blogs
 * page where the changelog, current build info and public roadmap live.
 */
const VersionBadge = () => {
    const touchdown = useStoreState((state) => state.settings.data?.touchdown);

    if (!touchdown) return null;

    const label = touchdown.channel === 'dev' ? 'Dev' : 'Alpha';

    return (
        <Badge to={'/dev-blogs'} title={`Build ${touchdown.build} — click for Dev-Blogs & roadmap`}>
            {label}
            <span>v{touchdown.version}</span>
        </Badge>
    );
};

export default VersionBadge;

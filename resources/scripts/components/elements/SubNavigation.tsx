import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: var(--tdh-surface);
    border-bottom: 1px solid var(--tdh-surface-border);
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            color: var(--tdh-text-muted);

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                color: #ffffff;
            }

            &:active,
            &.active {
                color: var(--tdh-brand-400);
                box-shadow: inset 0 -2px var(--tdh-brand-500);
            }
        }
    }
`;

export default SubNavigation;

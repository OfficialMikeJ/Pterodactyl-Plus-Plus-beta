import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-lg no-underline items-center p-4 border transition-all duration-150 overflow-hidden`};
    color: var(--tdh-text);
    background: var(--tdh-surface);
    border-color: var(--tdh-surface-border);
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);

    ${(props) =>
        props.$hoverable !== false &&
        `&:hover {
            border-color: var(--tdh-brand-500);
            box-shadow: 0 0 18px var(--tdh-glow);
        }`};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center p-3`};
        background: rgba(255, 255, 255, 0.08);
        color: var(--tdh-brand-400);
    }
`;

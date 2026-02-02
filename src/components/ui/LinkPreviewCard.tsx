import Microlink from '@microlink/react';
import styled from 'styled-components';

// Custom styled wrapper for Microlink to enforce theme consistency and full width
const StyledMicrolink = styled(Microlink)`
  width: 100%;
  max-width: 100%;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  margin: 0;
  font-family: inherit;
  box-sizing: border-box;
  text-decoration: none !important; /* Prevent underline */
  color: hsl(var(--card-foreground)) !important; /* Force text color to be neutral, overriding 'prose a' green */

  /* The main container of the card */
  &.microlink_card {
    border: none !important;
    background: transparent !important;
  }

  /* Override text colors to match theme */
  /* Title */
  header h3 {
     color: hsl(var(--card-foreground)) !important;
     font-weight: 600 !important;
  }

  /* Description */
  section p {
    color: hsl(var(--muted-foreground)) !important;
  }
  
  /* Url/Footer */
  footer span {
    color: hsl(var(--muted-foreground)) !important;
    opacity: 0.8;
  }
  
  /* Hover effects */
  &:hover {
    background-color: hsl(var(--accent) / 0.05);
    border-color: hsl(var(--input));
    color: hsl(var(--card-foreground)) !important; /* Keep text neutral on hover too */
  }
`;

interface LinkPreviewCardProps {
    url: string;
    className?: string;
}

const LinkPreviewCard = ({ url, className }: LinkPreviewCardProps) => {
    if (!url) return null;

    return (
        <div className={className}>
            <StyledMicrolink
                url={url}
                size="normal"
                media="image"
                lazy={true}
            />
        </div>
    );
};

export default LinkPreviewCard;

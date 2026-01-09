import React from 'react';
import { hasValidImage, getImageUrl } from '../utils/imageHelpers';

/**
 * Image component with automatic fallback
 * Shows emoji if no valid image URL
 */
function ImageWithFallback({ imageUrl, alt, fallbackEmoji = '💊', style, className }) {
    if (hasValidImage(imageUrl)) {
        return (
            <img
                src={getImageUrl(imageUrl)}
                alt={alt}
                style={style}
                className={className}
            />
        );
    }

    return <span style={style} className={className}>{fallbackEmoji}</span>;
}

export default ImageWithFallback;

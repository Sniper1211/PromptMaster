import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { localizePath } from '../../lib/locale';

/**
 * react-router <Link> that keeps the current language prefix (/zh) on internal links.
 * External links and non-string `to` values are passed through unchanged.
 */
const LocalizedLink: React.FC<LinkProps> = ({ to, ...rest }) => {
    const { currentLanguage } = useLanguage();
    const localized =
        typeof to === 'string' && to.startsWith('/') ? localizePath(to, currentLanguage) : to;
    return <Link to={localized} {...rest} />;
};

export default LocalizedLink;

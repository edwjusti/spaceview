import React from 'react';
// eslint-disable-next-line no-unused-vars
import Link, { LinkProps } from 'next/link';

const LinkWrapper: React.FC<LinkProps> = React.forwardRef(
  (
    { children, href, replace, as, shallow, ...props },
    ref?: React.Ref<HTMLAnchorElement>
  ) => (
    <Link href={href} as={as} replace={replace} shallow={shallow}>
      <a ref={ref} {...props}>
        {children}
      </a>
    </Link>
  )
);

export default LinkWrapper;

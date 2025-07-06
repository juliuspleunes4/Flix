import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
  in?: boolean;
  timeout?: number;
  classNames?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  in: inProp = true,
  timeout = 300,
  classNames = 'page-transition'
}) => {
  const nodeRef = React.useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={inProp}
      timeout={timeout}
      classNames={classNames}
      unmountOnExit
      appear
    >
      <div ref={nodeRef} className="page-transition-wrapper">
        {children}
      </div>
    </CSSTransition>
  );
};

export default PageTransition;

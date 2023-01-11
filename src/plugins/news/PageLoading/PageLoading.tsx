import * as React from "react";
import {WpLoadingIcon} from "bi-internal/ui";

const PageLoading = (props) => {
  return <article style={{ minHeight: '23.08rem' }}>
        <span className="magic-center" style={{ width: '15.38rem' }}>
          <WpLoadingIcon />
        </span>
  </article>
};

export default PageLoading;

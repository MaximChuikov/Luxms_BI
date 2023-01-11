import * as React from "react";
import {BIIcon} from "bi-internal/ui";
import {lang} from "bi-internal/utils";

const PageNoData = (props) => {
  const {localizationText} = props;
  return <article className="NewsPage empty view presentations" style={{ minHeight: 300, marginTop: 100 }}>
    <div className="magic-center"
         style={{ fontSize: '2.8rem', color: '#666666', width: '100%', maxWidth: '38.46rem', top: '9.85rem' }}>
      <BIIcon icon="empty" style={{ width: '100%', height: 128, textAlign: 'center' }} />
      <span dangerouslySetInnerHTML={{ __html: lang(localizationText) }} />
    </div>
  </article>;
}

export default PageNoData;

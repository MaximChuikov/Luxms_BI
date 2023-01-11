import * as React from "react";
import {BIIcon} from "bi-internal/ui";
import {lang} from "bi-internal/utils";
import './PageError.scss'

const PageError = (props) => {
  const {error} = props;
  return <article className="PageError" style={{ minHeight: '23.08rem' }}>
    <div className="magic-center" style={{ width: '95%', maxWidth: '30.77rem' }}>
      <BIIcon icon="bug"
              style={{
                display: 'inline-block',
                width: '4.92rem',
                height: '4.92rem',
                float: 'left',
                margin: '1.54rem',
              }} />
      <h2 style={{ fontWeight: 'normal', fontSize: '1.85rem', lineHeight: '4.92rem' }}>{lang('error')}</h2>
      <div style={{ clear: 'both' }}></div>
      <span style={{ width: '100%', display: 'inline-block', textAlign: 'center', fontSize: '1.3em' }}>{error}</span>
    </div>
  </article>
};

export default PageError;

import * as React from "react";

const IconLetterWithCounter = (props) => {
  let {counter} = props;
  if (counter > 99) {
    counter = 99;
  }
  return <svg viewBox="0 0 47 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.8219 15.8486V26.207L16.049 21.0269L9.8219 15.8486ZM19.9998 0C14.1567 0 8.89072 2.51932 5.23118 6.52725C1.9836 10.085 0 14.815 0 20.0005C0 31.0269 8.97186 40 19.9998 40C25.186 40 29.9163 38.0158 33.473 34.7672C37.4813 31.1065 40 25.8419 40 20.0005C40 8.96976 31.0286 0 19.9998 0ZM19.9998 37.4034C10.4044 37.4034 2.59748 29.5943 2.59748 20.0005C2.59748 10.4028 10.4044 2.5966 19.9998 2.5966C29.5956 2.5966 37.403 10.4028 37.403 20.0005C37.403 29.5943 29.5956 37.4034 19.9998 37.4034ZM22.2592 22.9289L21.1449 23.8553C20.6784 24.2431 19.9153 24.2431 19.4496 23.8553L18.0123 22.6599L17.1729 21.9619L10.4445 27.5575C10.7275 27.7845 11.0863 27.9217 11.4756 27.9217H29.1189C29.5082 27.9217 29.8671 27.7845 30.1501 27.5575L23.4212 21.9619L22.2592 22.9289ZM30.7727 26.207V15.8486L24.5456 21.0269L30.7727 26.207ZM29.1189 12.6256H11.4756C10.6618 12.6256 9.9808 13.2216 9.84654 13.9988L18.078 20.8443L19.4496 21.9851C19.9157 22.3735 20.6784 22.3735 21.1449 21.9851L22.5866 20.7863L30.7485 13.9988C30.6142 13.2216 29.9332 12.6256 29.1189 12.6256Z" fill="white"/>
    {counter &&
    <>
    <path d="M47 37.5C47 43.299 42.299 48 36.5 48C30.701 48 26 43.299 26 37.5C26 31.701 30.701 27 36.5 27C42.299 27 47 31.701 47 37.5Z" fill="#E21A1A"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M36.5 46C41.1944 46 45 42.1944 45 37.5C45 32.8056 41.1944 29 36.5 29C31.8056 29 28 32.8056 28 37.5C28 42.1944 31.8056 46 36.5 46ZM36.5 48C42.299 48 47 43.299 47 37.5C47 31.701 42.299 27 36.5 27C30.701 27 26 31.701 26 37.5C26 43.299 30.701 48 36.5 48Z" fill="white"/>
    <text textAnchor="middle" x="37" y="42" fill="white" fontSize="11px">{counter}</text>
    </>
    }
  </svg>
}

export default IconLetterWithCounter;
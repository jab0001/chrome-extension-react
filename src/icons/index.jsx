import React from "react";

export function LogoIcon({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 72 59" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.870117" y="0.843262" width="70.6817" height="57.8305" rx="6.42561" fill="url(#paint0_linear_105_1033)" />
      <path d="M14.6179 36.6235H11.4525V18.311H26.3379V21.2934H14.6179V25.9761H25.0299V28.9584H14.6179V36.6235ZM28.0247 36.6235V18.311H31.1901V33.6412H42.4392V36.6235H28.0247ZM42.4605 27.4673C42.4605 24.1885 43.2017 21.8079 44.6841 20.3254C46.184 18.8255 48.5733 18.0756 51.8522 18.0756C54.5554 18.0756 56.6396 18.5814 58.1046 19.5929C59.5696 20.587 60.5201 22.1654 60.9561 24.328H57.6337C56.8488 22.1479 54.9217 21.0579 51.8522 21.0579C49.6721 21.0579 48.085 21.5724 47.0909 22.6014C46.1142 23.6129 45.6259 25.2349 45.6259 27.4673C45.6259 29.7171 46.1404 31.3478 47.1694 32.3593C48.2158 33.3709 49.9424 33.8767 52.3492 33.8767C54.2328 33.8767 55.6019 33.5889 56.4564 33.0134C57.3285 32.4378 57.7645 31.5222 57.7645 30.2665V29.4555H51.6952V26.6825H60.9299V30.2665C60.9299 32.5686 60.241 34.2429 58.8632 35.2893C57.5029 36.3358 55.3228 36.859 52.323 36.859C48.8175 36.859 46.2974 36.1178 44.7626 34.6353C43.2278 33.1529 42.4605 30.7635 42.4605 27.4673Z" fill="black" />
      <path d="M14.6179 36.6235H11.4525V18.311H26.3379V21.2934H14.6179V25.9761H25.0299V28.9584H14.6179V36.6235Z" fill="black" />
      <rect width="49.3076" height="2.90045" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 60.9213 39.8152)" fill="black" />
      <defs>
        <linearGradient id="paint0_linear_105_1033" x1="36.211" y1="0.843262" x2="36.211" y2="58.6738" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5DD6D" />
          <stop offset="1" stop-color="#FFCD4D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SearchIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.4737 19.6321H20.135L19.6605 19.1746C21.3212 17.2428 22.321 14.7349 22.321 12.0067C22.321 5.92329 17.3899 0.992188 11.3065 0.992188C5.22309 0.992188 0.291992 5.92329 0.291992 12.0067C0.291992 18.0901 5.22309 23.0212 11.3065 23.0212C14.0347 23.0212 16.5426 22.0214 18.4744 20.3607L18.9319 20.8352V22.1739L27.4046 30.6296L29.9294 28.1048L21.4737 19.6321ZM11.3065 19.6321C7.08708 19.6321 3.68106 16.2261 3.68106 12.0067C3.68106 7.78728 7.08708 4.38126 11.3065 4.38126C15.5259 4.38126 18.9319 7.78728 18.9319 12.0067C18.9319 16.2261 15.5259 19.6321 11.3065 19.6321Z" fill={color} />
    </svg>
  );
}

export function StarIcon({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L15.2651 4.11746L20.4853 3.51472L19.8825 8.73495L24 12L19.8825 15.2651L20.4853 20.4853L15.2651 19.8825L12 24L8.73495 19.8825L3.51472 20.4853L4.11746 15.2651L0 12L4.11746 8.73495L3.51472 3.51472L8.73495 4.11746L12 0Z" fill="url(#paint0_linear_175_1482)" />
      <path d="M14.6302 16L13.9454 13.821H10.7891L10.1042 16H8.17432L11.2933 7.01648H13.5034L16.6287 16H14.6302ZM12.3455 8.73474L11.1937 12.4141H13.5408L12.389 8.73474H12.3455Z" fill="url(#paint1_linear_175_1482)" />
      <defs>
        <linearGradient id="paint0_linear_175_1482" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5DD6D" />
          <stop offset="1" stop-color="#FFCD4D" />
        </linearGradient>
        <linearGradient id="paint1_linear_175_1482" x1="12.5" y1="4" x2="12.5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stop-color="#312D19" />
          <stop offset="1" stop-color="#92752A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CursorIcon({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="9" width="12" height="12" rx="6" fill="url(#paint0_linear_175_1741)" />
      <line x1="16" y1="1" x2="16" y2="30" stroke="url(#paint1_linear_175_1741)" stroke-width="2" stroke-linecap="round" />
      <line x1="30" y1="15" x2="1" y2="15" stroke="url(#paint2_linear_175_1741)" stroke-width="2" stroke-linecap="round" />
      <defs>
        <linearGradient id="paint0_linear_175_1741" x1="16" y1="9" x2="16" y2="21" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5DD6D" />
          <stop offset="1" stop-color="#FFCD4D" />
        </linearGradient>
        <linearGradient id="paint1_linear_175_1741" x1="15" y1="15.5" x2="14" y2="15.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5DD6D" />
          <stop offset="1" stop-color="#FFCD4D" />
        </linearGradient>
        <linearGradient id="paint2_linear_175_1741" x1="15.5" y1="14" x2="15.5" y2="13" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5DD6D" />
          <stop offset="1" stop-color="#FFCD4D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BinIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.6 6.225L5.83333 7.99167L4.05833 6.225L2.88333 7.4L4.65833 9.16667L2.89167 10.9333L4.06667 12.1083L5.83333 10.3417L7.6 12.1083L8.775 10.9333L7.00833 9.16667L8.775 7.4L7.6 6.225ZM8.75 0.833333L7.91667 0H3.75L2.91667 0.833333H0V2.5H11.6667V0.833333H8.75ZM0.833333 13.3333C0.833333 14.25 1.58333 15 2.5 15H9.16667C10.0833 15 10.8333 14.25 10.8333 13.3333V3.33333H0.833333V13.3333ZM2.5 5H9.16667V13.3333H2.5V5Z" fill={color} />
    </svg>

  );
}

export function CartIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.7396 18.9976C26.0043 18.9976 27.1173 18.3062 27.6907 17.2607L33.7278 6.31626C34.3518 5.20327 33.5423 3.82046 32.2607 3.82046H7.30267L5.7175 0.447754H0.203125V3.82046H3.57583L9.6467 16.6199L7.37013 20.7346C6.13909 22.9943 7.75799 25.7431 10.3212 25.7431H30.5575V22.3704H10.3212L12.1762 18.9976H24.7396ZM8.90471 7.19317H29.3939L24.7396 15.6249H12.9014L8.90471 7.19317ZM10.3212 27.4294C8.46626 27.4294 6.9654 28.9471 6.9654 30.8021C6.9654 32.6571 8.46626 34.1748 10.3212 34.1748C12.1762 34.1748 13.694 32.6571 13.694 30.8021C13.694 28.9471 12.1762 27.4294 10.3212 27.4294ZM27.1848 27.4294C25.3298 27.4294 23.8289 28.9471 23.8289 30.8021C23.8289 32.6571 25.3298 34.1748 27.1848 34.1748C29.0398 34.1748 30.5575 32.6571 30.5575 30.8021C30.5575 28.9471 29.0398 27.4294 27.1848 27.4294Z" fill={color} />
    </svg>
  );
}

export function FavoriteIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.6803 25.186L11.7054 23.3881C4.69126 17.0277 0.0605469 12.8328 0.0605469 7.68458C0.0605469 3.4897 3.35652 0.193726 7.5514 0.193726C9.92124 0.193726 12.1957 1.29692 13.6803 3.04025C15.1648 1.29692 17.4393 0.193726 19.8092 0.193726C24.0041 0.193726 27.3 3.4897 27.3 7.68458C27.3 12.8328 22.6693 17.0277 15.6552 23.4018L13.6803 25.186Z" fill={color} />
    </svg>
  );
}

export function InfoIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3016 7.1249H16.0583V9.88159H13.3016V7.1249ZM13.3016 12.6383H16.0583V20.9084H13.3016V12.6383ZM14.68 0.233154C7.07149 0.233154 0.896484 6.40816 0.896484 14.0166C0.896484 21.6251 7.07149 27.8001 14.68 27.8001C22.2885 27.8001 28.4635 21.6251 28.4635 14.0166C28.4635 6.40816 22.2885 0.233154 14.68 0.233154ZM14.68 25.0434C8.60145 25.0434 3.65318 20.0952 3.65318 14.0166C3.65318 7.93812 8.60145 2.98985 14.68 2.98985C20.7585 2.98985 25.7068 7.93812 25.7068 14.0166C25.7068 20.0952 20.7585 25.0434 14.68 25.0434Z" fill={color} />
    </svg>
  );
}

export function CloseIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill={color} />
    </svg>
  );
}

export function ShareIcon({ width, height, color = '#D9D9D9' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.2778 10.2778H1.28472V1.28472H5.78125V0H1.28472C0.571701 0 0 0.578125 0 1.28472V10.2778C0 10.9844 0.571701 11.5625 1.28472 11.5625H10.2778C10.9844 11.5625 11.5625 10.9844 11.5625 10.2778V5.78125H10.2778V10.2778ZM7.06597 0V1.28472H9.37205L3.05764 7.59913L3.96337 8.50486L10.2778 2.19045V4.49653H11.5625V0H7.06597Z" fill={color} />
    </svg>
  );
}

export function GirlIcon({ className }) {
  return (
    <img className={className} src="data:image/png;base64,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"
    />
  )
}
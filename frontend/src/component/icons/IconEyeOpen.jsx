import { cns } from "../../utils/classnames";

const IconEyeOpen = ({
  className = "",
  ...props
}) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cns("icon", className)}
  >
    <path 
      d="M2.06202 12.348C1.97868 12.1235 1.97868 11.8765 2.06202 11.652C2.87372 9.68385 4.25153 8.00103 6.02079 6.81689C7.79004 5.63275 9.87106 5.00061 12 5.00061C14.129 5.00061 16.21 5.63275 17.9792 6.81689C19.7485 8.00103 21.1263 9.68385 21.938 11.652C22.0214 11.8765 22.0214 12.1235 21.938 12.348C21.1263 14.3161 19.7485 15.999 17.9792 17.1831C16.21 18.3672 14.129 18.9994 12 18.9994C9.87106 18.9994 7.79004 18.3672 6.02079 17.1831C4.25153 15.999 2.87372 14.3161 2.06202 12.348Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 15C13.6569 15 15 13.6568 15 12C15 10.3431 13.6569 8.99999 12 8.99999C10.3432 8.99999 9.00002 10.3431 9.00002 12C9.00002 13.6568 10.3432 15 12 15Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export { IconEyeOpen };
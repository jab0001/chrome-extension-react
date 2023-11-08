import styles from "../styles/index.css";

const classNames = (classes) => {

  switch (typeof classes) {
    case 'string':
      return classes.split(" ").map(cl => styles[cl]).join(' ');
    case 'object':
      return classes.isArray() ? classes.map(cl => styles[cl]).join(' ') : null;
    default:
      return null;
  }
}

export default classNames;

export const clx = (...classes) => {
  return [...classes].join(' ');
}
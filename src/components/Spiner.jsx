import "./spinner.css";

export default function Spinner({w, h}) {
    return <div className="spinner" style={{width: `${w}px`, height: `${h}px`}} role="status" aria-label="Loading" />;
}
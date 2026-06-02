import Loader from "../../components/loader/Loader";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #0a0a0a)",
        zIndex: 9999,
      }}
    >
      <Loader />
    </div>
  );
}
export default function ChatMessage({ role, text }) {

  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      {!isUser && (
        <div style={{ marginRight: "8px" }}>🤖</div>
      )}

      <div
        style={{
          background: isUser ? "#4CAF50" : "#2a2a2a",
          color: "white",
          padding: "12px 14px",
          borderRadius: "12px",
          maxWidth: "60%",
          lineHeight: "1.5",
          fontSize: "14px",
        }}
      >
        {text}
      </div>

      {isUser && (
        <div style={{ marginLeft: "8px" }}>👤</div>
      )}
    </div>
  );
}
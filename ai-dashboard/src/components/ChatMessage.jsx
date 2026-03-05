export default function ChatMessage({ role, text }) {

  const isUser = role === "user";

  return (

    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>

      {!isUser && (
        <div className="mr-2 text-xl">🤖</div>
      )}

      <div
        className={`px-4 py-2 rounded-xl max-w-xl text-sm ${
          isUser
            ? "bg-green-500 text-white"
            : "bg-gray-700 text-gray-100"
        }`}
      >
        {text}
      </div>

      {isUser && (
        <div className="ml-2 text-xl">👤</div>
      )}

    </div>

  );

}